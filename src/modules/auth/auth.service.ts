import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { RefreshTokenDTO, SignInDTO, SignUpDTO } from './dto';

import { enumData } from 'src/constants/enum-data';
import { JWT_SECRET } from 'src/constants/key';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private repo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDTO) {
    const user: any = await this.repo.findOne({
      where: { username: signInDto.username },
      relations: {
        userDetail: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isPasswordCorrect = await user.comparePassword(signInDto.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password incorrect!');
    }

    const payload = {
      uid: user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = {
      uid: user.id,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    const userDetail = user.__userDetail__;
    delete user.__userDetail__;
    delete user.password;

    return {
      accessToken,
      refreshToken,
      enumData,
      user: { ...user, userDetail },
    };
  }

  async signUp(signUpDTO: SignUpDTO) {
    if (await this.repo.findOneBy({ username: signUpDTO.username })) {
      throw new UnauthorizedException('User already exists!');
    }

    if (signUpDTO.password !== signUpDTO.confirmPassword) {
      throw new UnauthorizedException('Password not match!');
    }

    const newUser = new UserEntity();
    newUser.username = signUpDTO.username;
    newUser.password = signUpDTO.password;
    newUser.avatar =
      'https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-6299539-5187871.png?f=webp';
    newUser.isActive = true;
    newUser.verifyAt = new Date();
    return await this.repo.insert(newUser);
  }

  async convertJsonGitHubToSignUpDTO(jsonData: any) {
    const signUpDTO = new SignUpDTO();
    signUpDTO.username = jsonData.emails[0].value;
    signUpDTO.password = jsonData.username;
    signUpDTO.confirmPassword = jsonData.username;

    return signUpDTO;
  }

  async convertJsonGoogleToSignUpDTO(jsonData: any) {
    const signUpDTO = new SignUpDTO();
    signUpDTO.username = jsonData.emails[0].value;
    signUpDTO.password = jsonData.displayName;
    signUpDTO.confirmPassword = jsonData.displayName;

    return signUpDTO;
  }

  async convertJsonFacebookToSignUpDTO(jsonData: any) {
    const signUpDTO = new SignUpDTO();
    signUpDTO.username = jsonData.displayName;
    signUpDTO.password = jsonData.id;
    signUpDTO.confirmPassword = jsonData.id;

    return signUpDTO;
  }

  async convertSignUpDTOToSignInDTO(signUpDTO: SignUpDTO) {
    const signInDTO = new SignInDTO();
    signInDTO.username = signUpDTO.username;
    signInDTO.password = signUpDTO.password;

    return signInDTO;
  }

  async checkUserExist(username: string): Promise<boolean> {
    const user = await this.repo.findOneBy({ username });
    return !!user;
  }

  async refreshToken(data: RefreshTokenDTO) {
    const { id } = this.jwtService.verify(data.refreshToken, {
      secret: JWT_SECRET,
    });
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new UnauthorizedException('User not found!');

    const payload = {
      uid: user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshPayload = {
      uid: user.id,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async getUserById(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }
}
