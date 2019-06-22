/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Controller from "./controller"
import logger from "../util/logger"
import model from "../models/model"
import { ObjectId } from "mongodb"
import config from "../util/config-loader"
import fetch from "cross-fetch"
import formatRoute from "../util/format-route"
import { webAddress, cvAddress } from "../util/address"
import crypto from "crypto"
import {
  CV_STATUS_NOT_STARTED,
  CV_STATUS_CANCELED,
  CV_STATUS_FAILED,
  WEB_STATUS_BAD_REQUEST,
  WEB_STATUS_INTERNAL_SERVER_ERROR,
  WEB_STATUS_NOT_FOUND,
  WEB_STATUS_FORBIDDEN,
  WEB_STATUS_OK,
  CV_STATUS_STARTED
} from "../util/status-codes"



const objectDetectionRouteInfo = config.web_api.route.object_detection

const objectDetectionUrl = (name, id) => webAddress + objectDetectionRouteInfo.sub_route +
  formatRoute(objectDetectionRouteInfo[name], id !== undefined ? { video_id: id } : undefined)

const cvObjectDetectionRouteInfo = config.cv_api.route.object_detection

const cvObjectDetectionUrl = (name, mapping) => cvAddress + cvObjectDetectionRouteInfo.sub_route +
  formatRoute(cvObjectDetectionRouteInfo[name], mapping)


const isObjectDetectionStatusValid = code => code === CV_STATUS_NOT_STARTED || code === CV_STATUS_CANCELED || code === CV_STATUS_FAILED

class ObjectDetectionController extends Controller {

  start = async (req, res) => {
    const { videoId } = req.params
    try {
      if (!ObjectId.isValid(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, WEB_STATUS_BAD_REQUEST, { message: err.message })
      return
    }
    try {
      await model.connect()
      const video = await model.db.collection("videos").findOne({ _id: ObjectId(videoId) })
      if (video) {
        if (isObjectDetectionStatusValid(video.object_detection_status)) {
          const startUrl = cvObjectDetectionUrl("start_object_detection", { video_id: videoId })
          await fetch(startUrl)
          const _links = {
            self: objectDetectionUrl("start", videoId),
            cancel: objectDetectionUrl("cancel", videoId)
          }
          this._send(res, WEB_STATUS_OK, {}, _links)
        }
        else {
          this._send(res, WEB_STATUS_FORBIDDEN, { message: "Object detection is either completed or started already" })
        }
      }
      else {
        this._send(res, WEB_STATUS_BAD_REQUEST, { message: "Invalid videoId" })
      }
    } catch (err) {
      this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  cancel = async (req, res) => {
    const { videoId } = req.params
    try {
      if (!ObjectId.isValid(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, WEB_STATUS_BAD_REQUEST, { message: err.message })
      return
    }

    try {
      await model.connect()
      const video = await model.db.collection("videos").findOne({ _id: ObjectId(videoId) })
      if (video) {
        if (video.object_detection_status === CV_STATUS_STARTED) {
          const cancelUrl = cvObjectDetectionUrl("cancel_object_detection", { video_id: videoId })
          await fetch(cancelUrl)
          const _links = {
            self: objectDetectionUrl("cancel", videoId)
          }
          this._send(res, WEB_STATUS_OK, {}, _links)
        }
        else {
          this._send(res, WEB_STATUS_FORBIDDEN, { message: "Object detection is not yet started" })
        }
      }
      else {
        this._send(res, WEB_STATUS_BAD_REQUEST, { message: "Invalid videoId" })
      }
    } catch (err) {
      this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }

  }
}

export default (new ObjectDetectionController)