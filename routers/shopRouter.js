import express from "express";
import { shop, shopDetail } from "../controllers/shopController";
import routes from "../routes";


const shopRouter = express.Router();

shopRouter.get(routes.shop, shop);
shopRouter.get(routes.shopDetail, shopDetail);


export default shopRouter;