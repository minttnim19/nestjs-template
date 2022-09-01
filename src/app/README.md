# Folder `structure` and example `writing`

### Structure of `module` ,`controller` ,`service` ,`repository` and `entity`

    .
    ├── ...
    ├── app
    │   ├── v1
    │   │   ├── users
    │   │   │   └── users.controller.ts
    │   └── └── └── users.module.ts
    ├── services
    │   ├── v1
    │   │   └── users
    │   └── └── └── users.service.ts
    ├── entities
    │   ├── users
    │   │   └── repository
    │   │   │   └── users.repository.ts
    │   └── └── users.entity.ts
    └── ...

### Example:

```typescript
// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
```

```typescript
// users.controller.ts
@Controller()
export class UsersController {
  constructor(private readonly service: UsersService) {}
  
  @Get()
  @HttpCode(200)
  @SetMetadata('roles', ['admin']) // Optional
  @SetMetadata('permissions', ['users.*', 'users.list']) // Optional
  @UseGuards(JwtGuard, AuthorizationGuard)
  @UseInterceptors(new LoggingInterceptor('GetUserList')) // for logging is optional
  @UseInterceptors(new TransformPaginate<Users>())
  async list(@Req() request: Request, @QueryScopes() query: UsersDTO): Promise<Pagination<Users>> {
    return await this.service.list(request, query)
  }
}
```

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly repo: UsersRepository
  ) {}

  async list(request: Request, query: UsersDTO): Promise<Pagination<Users>> {
    const { page, limit, select, orderBy, sortedBy, include } = query
    const options: IPaginationOptions = paginateOption(request, page, limit)
    const searchOption: IBuilderCriteria = await builderCriteria<UsersDTO>(
      this.repo,
      query,
      select,
      orderBy,
      sortedBy,
      include
    )
    return paginate<Users>(this.repo, options, searchOption)
  }
}
```

```typescript
// users.repository.ts
@EntityRepository(Users)
export class UsersRepository extends Repository<Users> implements IRepositoryClassInterface {
  readonly tableName: string = 'users'
  readonly selectable: string[] = ['id', 'name']
  readonly searchable: IFieldSearchable = {
    id: '=',
    name: 'like',
    created_start_at: 'date',
    created_end_at: 'date',
    updated_start_at: 'date',
    updated_end_at: 'date'
  }
  readonly dateRangeSearchable: string[] = ['created_at', 'updated_at']
  readonly includeAvailable: string[] = []
}
```

```typescript
// users.entity.ts
@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-json')
  name: ILocales

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP()',
    transformer: new DateTimeTransformer()
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
    transformer: new DateTimeTransformer()
  })
  updated_at: Date

  public static of(params: Partial<Example>): Example {
    const entity = new Example()
    Object.assign(entity, params)
    return entity
  }
}
```
