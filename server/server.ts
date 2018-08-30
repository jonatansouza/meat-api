import * as fs from 'fs';
import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { environment } from '../common/environment'
import { Router } from '../common/router'
import {mergePatchBodyParser} from './merge-patch.parser'
import { handleError } from './error-handler';
import { tokenParser } from '../security/token.parser';
import { logger } from '../common/logger';

export class Server {
    application: restify.Server

    initializeDb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                }
                if(environment.security.enableHTTPS){
                    options.certificate = fs.readFileSync(environment.security.certificate)
                    options.key = fs.readFileSync(environment.security.key)
                }
                this.application = restify.createServer(options)

                /**
                 * logger config
                 */
                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }))

                /**
                 * Parser dos parametros
                 */
                this.application.use(restify.plugins.queryParser())
                /**
                 * Parser do body
                 */
                this.application.use(restify.plugins.bodyParser())

                /**
                 * Adicionando suporte ao metodo PATCH
                 * adicionando o application/merge-patch+json
                 */
                this.application.use(mergePatchBodyParser)
                

                this.application.use(tokenParser)

                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)
                /**
                 * event loggers, tomar muito cuidado com os logs de dados sensíveis,
                 * tipo token de autenticação e passwords no body 
                 */
                 this.application.on('after', restify.plugins.auditLogger({
                    log: logger,
                    event: 'after',
                    body: true
                }))

            } catch (error) {
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this))
    }

    shutdown(){
        return mongoose.disconnect().then(() => {
            this.application.close();
        })
    }
}