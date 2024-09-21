import { NPM_PACKAGE_VERSION } from '../config/env.mjs';
import { clients } from '../config/db.mjs';


const health = async (req, res, next) => {
  const response = {};
  let error = false;

  try { 
    response.version = NPM_PACKAGE_VERSION;
  } catch (e) {
    error = true;
    response.version = e.message;
  }

  try { 
    await clients.zestyDb.raw('SELECT 1 AS status');
    response.zestyDb = true;
  } catch (e) {
    error = true;
    response.zestyDb = e.message;
  }

  try {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }

  } catch (err) {
    next(err);
  }
};

const favicon = async (req, res, next) => {
  res.status(404).json({});
};

export default {
  health,
  favicon
};