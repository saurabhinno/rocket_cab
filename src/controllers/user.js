import BaseAPIController from "./BaseAPIController";
import userProvider from '../providers/userProvider';
import _ from "lodash";
import sendSMS from './../service/sendSMS';

export class UserController extends BaseAPIController {

    register = (req, res, next) => {
        userProvider.userRegistration(req.checkBody, req.body, req.getValidationResult()).then((body) => {
            var val = Math.floor(1000 + Math.random() * 9000);
            body['OTPS'] = val;
            this._db.userRegistration.create(body).then((response) => {
                    sendSMS.send(response.phone, response.OTPS);
                    res.json({ data: response, status: 1, message: 'success' })
                }, (err) => this.handleErrorResponse(res, err))
        }, (err) => this.handleErrorResponse(res, err))
    }

    login = (req, res, next) => {
        this._db.userRegistration.findOne({ where: { phone: req.body.phone } }).then((response) => {
            if(response) {
                res.json({ data: response, status: 1, message: 'success' })
            } else {
                this.handleErrorResponse(res, 'not found')
            }
        }, (err) => this.handleErrorResponse(res, err))
    }
    
    verifyOTP = (req, res, next) => {
        this._db.userRegistration.findOne({ where: { phone: req.body.phone, OTPS: req.body.otp } }).then((response) => {
            if(response) {
                res.json({ data: response, status: 1, message: 'success' })
            } else {
                this.handleErrorResponse(res, 'not found')
            }
        }, (err) => this.handleErrorResponse(res, err))
    }
}

const controller = new UserController();
export default controller;