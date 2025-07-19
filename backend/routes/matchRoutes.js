import express from "express";

import { getAllMatches,getMatchById,updateMatch,createMatch,addEventToMatch} from "../controllers/matchControllers.js";


const Routers = express.Router();

Routers.get('/getallmatches',getAllMatches);
Routers.get('/get-match-by/:id',getMatchById);
Routers.put('/update-match-by/:id',updateMatch);
Routers.post('/create-match',createMatch);
Routers.post('/add-event-to-match/:id',addEventToMatch);

export default Routers;