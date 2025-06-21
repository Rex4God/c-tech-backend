"use strict";
const Model =require("../models/BlogModel")
const Repository =require("./MongoDBRepository")

class BlogRepository extends Repository{
    constructor(){
        super(Model)
    };
};
module.exports =(new BlogRepository())