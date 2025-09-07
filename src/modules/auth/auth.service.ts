// src/modules/auth/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "src/entities/users/user.entity";
import * as bcrypt from 'bcrypt';
import { Role } from "src/constants/role";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.cfg.get('JWT_ACCESS_SECRET'),
        expiresIn: this.cfg.get('JWT_ACCESS_EXPIRES', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.cfg.get('JWT_REFRESH_SECRET'),
        expiresIn: this.cfg.get('JWT_REFRESH_EXPIRES', '7d'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async saveRefreshHash(userId: User['id'], refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 12);
    await this.usersService.update(userId, { hashedRefreshToken: hash });
  }

  private toUser(u: User | User[]): User {
    return Array.isArray(u) ? u[0] : u;
  }

  async register(email: User['email'], password: User['password']) {
    const exist = await this.usersService.findByEmail(email);
    if (exist) throw new BadRequestException('email already used');

    const hash = await bcrypt.hash(password, 12);
    const created = await this.usersService.create({
      email,
      password: hash,
      role: Role.User,
    } as Partial<User>);

    const user = this.toUser(created);

    const { accessToken, refreshToken } = await this.issueTokens(user);
    await this.saveRefreshHash(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async login(email: User['email'], password: User['password']) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('invalid credentials');

    const { accessToken, refreshToken } = await this.issueTokens(user);
    await this.saveRefreshHash(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  // ✅ 누락되어 있던 메서드 추가
  async refresh(userId: string, presentedRefreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

    const ok = await bcrypt.compare(presentedRefreshToken, user.hashedRefreshToken);
    if (!ok) throw new UnauthorizedException();

    const { accessToken, refreshToken } = await this.issueTokens(user);
    await this.saveRefreshHash(user.id, refreshToken); // 회전
    return { accessToken, refreshToken };
  }

  // ✅ 로그아웃 메서드도 추가(컨트롤러에서 호출)
  async logout(userId: string) {
    await this.usersService.update(userId, { hashedRefreshToken: null });
    return { ok: true };
  }
}
