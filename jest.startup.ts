import { Server } from './server/server';
import { usersRouter } from './users/users.router'
import { reviewsRouter } from './reviews/reviews.router'
import { restaurantsRouter } from './restaurants/restaurants.router'
import { environment } from './common/environment'
import { User } from './users/users.model';
import { Review } from './reviews/reviews.model';
import * as jestCli from 'jest-cli'
import { Restaurant } from './restaurants/restaurants.model';

let address: string
let server: Server
const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    address = (<any>global).address
    server = new Server();
    return server.bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
        .then(() => User.remove({}).exec())
        .then(() => {
            let admin = new User()
            admin.name = 'admin',
            admin.email = 'batman@dc.com',
            admin.password = 'morcego',
            admin.profiles = ['admin', 'user']
            return admin.save()
        })
        .then(() => Restaurant.remove({}).exec())
        .then(() => Review.remove({}).exec())
        .catch(console.error)
}

const afterAllTests = () => {
    return server.shutdown();

}

beforeAllTests()
    .then(()=> jestCli.run())
    .then(()=> server.shutdown())