import * as restify from 'restify';
import { Restaurant } from './restaurants.model'
import { ModelRouter } from '../common/model.router';
import { NotFoundError } from 'restify-errors';


class RestaurantRouter extends ModelRouter<Restaurant>{
    constructor(){
        super(Restaurant)
    }

    findMenu = (req, res, next) => {
        Restaurant.findById(req.params.id, "+menu")
            .then(rest => {
                if(!rest){
                    throw new NotFoundError('Restaurant not found!')
                }
                res.json(rest.menu)
                return next();
            }).catch(next)
    }
    replaceMenu = (req, res, next) => {
        Restaurant.findById(req.params.id)
        .then(rest => {
            if(!rest){
                throw new NotFoundError('Restaurant not found!')
            } else{
                rest.menu = req.body //array menu item
                return rest.save();
            }   
        }).then(rest => {
            res.json(rest.menu)
            return next();

        }).catch(next)
        
    }

    applyRoutes(application: restify.Server) {
        application.get('/restaurants', this.findAll)
        application.get('/restaurants/:id', [ this.validateId, this.findById ])
        application.post('/restaurants', this.save)
        application.put('/restaurants/:id', [ this.validateId, this.replace])
        application.patch('/restaurants/:id',[ this.validateId, this.update])
        application.del('/restaurants/:id', [ this.validateId,this.delete])

        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu])
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu])
    }

}

export const restaurantsRouter = new RestaurantRouter();