import { IndexModule } from '@app/index/index.module'
import { Routes } from '@nestjs/core'
// import { example as v1Example } from '@routes/v1/example'

export const routes: Routes = [
  {
    path: '/',
    module: IndexModule,
    children: [
      // {
      //   path: 'v1',
      //   children: [v1Units]
      // }
    ]
  }
]
