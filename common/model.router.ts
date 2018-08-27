import * as mongoose from 'mongoose';
import { Router } from './router';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>){
        super();
    }

    validateId = (req, res, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new NotFoundError('Document not found!'))
        } else{
            next();
        }
    }

    findAll =  (req, res, next) => {
        this.model.find().then(this.renderAll(res, next))
                    .catch(next)
    }
    findById = (req, res, next) => {
        this.model.findById(req.params.id).then(this.render(res, next)).catch(next)
    }
    save = (req, res, next) => {
        let doc = new this.model(req.body);
        doc.save().then(this.render(res, next)).catch(next)
    }
    replace =  (req, res, next) => {
        const options = { 
            overwrite: true,
            runValidators: true
        }
        this.model.update({ _id: req.params.id }, req.body, options)
            .exec()
            .then((result) => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                } else {
                    throw new NotFoundError('Documento não encontrado!')
                }
            }).then(this.render(res, next)).catch(next)
    }
    update = (req, res, next) => {
        const options = { new: true, runValidators: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .exec()
            .then(this.render(res, next)).catch(next)
    }
    delete =  (req, res, next) => {
        this.model.remove({ _id: req.params.id })
            .exec()
            .then((cmdResult: any) => {
                if (cmdResult.result.n) {
                    res.send(204);
                } else {
                    throw new NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next)
    }
}