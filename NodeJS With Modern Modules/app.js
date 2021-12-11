// const express = require("express");
import express from 'express';

const app = express();

import { resHandler } from './response-handler.js'

app.get("/", resHandler);

app.listen(3000);
