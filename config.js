/*make a config file
*/

//Create an environment object

var environments = {};

//create staging environment

environments.staging = {
'envName':'staging',
'httpPort':3000,
'httpsPort':3001


};

//create product environment

environments.production ={
'envName':'production',
'httpPort':5000,
'httpsPort':5001

};

//make staging as default environment

var currentEnvironment = typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof(environments[currentEnvironment])=='object' ? environments[currentEnvironment] :environments.staging;
module.exports=environmentToExport;