const _       = require('../lib/functions')
const request = require('request');

module.exports = (req, res) => {

    // rpt bug
    req.body.args = _.clearArgs(req.body.args);

    let { 
        apiKey, 
        fields,
        excludeFields,
        to="to" } = req.body.args;

    let r  = {
        callback     : "",
        contextWrites: {}
    };

    if(!apiKey) {
        _.echoBadEnd(r, to, res, 'apiKey');
        return;
    }


    //get datacenter
    let dcarr = apiKey.split('-'),
        dc    = dcarr[dcarr.length-1] + '.';

    let options = {
        url: `https://${dc}api.mailchimp.com/3.0/automations`, 
        qs: { apikey: apiKey},
    }

    if(fields)        options.qs.fields         = fields;
    if(excludeFields) options.qs.exclude_fields = excludeFields;

    return request(options, (err, response, body) => {
        if(!err && response.statusCode == 200) {
            r.contextWrites[to] = JSON.parse(body);
            r.callback = 'success'; 
        } else {
            r.contextWrites[to] = JSON.parse(err || body);
            r.callback = 'error';
        }

        res.status(200).send(r);
    });
}