import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const users = [
    {
        id: 10,
        username: 'john',
        password: '123',
    },
    {
        id: 2,
        username: 'jane',
        password: '456',
    }
]


@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
    ) {}


    login(username: string, password: string) {
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
