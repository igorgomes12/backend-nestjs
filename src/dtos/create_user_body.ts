import { IsNotEmpty, Length } from 'class-validator'

export class CreateUserBody {
  @IsNotEmpty({
    message: 'O nome do usuário é obrigatório',
  })
  @Length(5, 100)
  name_user: string | undefined

  @IsNotEmpty({
    message: 'O e-mail do usuário é obrigatório',
  })
  email_login_user: string | undefined

  @IsNotEmpty({
    message: 'A senha do usuário é obrigatória',
  })
  @Length(5, 100)
  password_user: string | undefined

  channel_user: number | undefined

  @IsNotEmpty({
    message: 'O perfil do usuário é obrigatório',
  })
  profile_user: number | undefined

  status_user: string | undefined

  company_user: string | undefined
}
