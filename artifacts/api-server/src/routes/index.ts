import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import statesRouter from "./states";
import citiesRouter from "./cities";
import listingsRouter from "./listings";
import seoRouter from "./seo";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";
import sitemapRouter from "./sitemap";
import importRouter from "./import";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(statesRouter);
router.use(citiesRouter);
router.use(listingsRouter);
router.use(seoRouter);
router.use(settingsRouter);
router.use(dashboardRouter);
router.use(sitemapRouter);
router.use(importRouter);

export default router;
