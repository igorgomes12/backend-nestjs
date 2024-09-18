// import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
// import { TClientFormData } from "./entities/dtos/zod_validations";
// import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
// import { Roles } from "@infra/middleware/decorator.rolues";
// import { RolesGuard } from "@infra/middleware/roles_guard";

// @Controller('client')
// export class ClientController {  
//     @Get('/list') 
//     @HttpCode(HttpStatus.OK)
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Roles(
//       "admin",
//       "user",
//       "suport",
//       "sellers",
//       "user_basic",
//       "user_intermediate",
//       "user_premium"
//     )
//     async getClient(@Query() query:TClientFormData ) {
      
//         return 'ok'
     
//     }
// }