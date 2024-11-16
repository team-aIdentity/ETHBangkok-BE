import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieve all users.
   * GET /user
   */
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Retrieve a single user by ID.
   * GET /user/:id
   * @param id - User ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Retrieve a single user by account.
   * Get /user/:account
   * @param account - User Account
   */
  @Get('/account/:account')
  async findOneByAccount(@Param('account') account: string): Promise<User> {
    const user = await this.userService.findOneByAccount(account);
    if (!user) {
      throw new NotFoundException(`User with account ${account} not found`);
    }
    return user;
  }

  /**
   * Create a new user.
   * POST /user
   * @param createUserDto - Data Transfer Object for creating a user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * Update an existing user by ID.
   * PUT /user/:id
   * @param id - User ID
   * @param updateUserDto - Partial Data Transfer Object for updating a user
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a user by ID.
   * DELETE /user/:id
   * @param id - User ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.userService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
