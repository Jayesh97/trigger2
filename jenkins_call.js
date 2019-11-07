//npm init --yes
//npm install request
//"116377b0664c6134c003dca90ab543d280"
var request = require('request');

var jenkins_config = {username:"admin",token:"116377b0664c6134c003dca90ab543d280",project_name:'se_p'}
var botwa_config = {url:"http://162.222.180.32:3000/jenkins"}

function getDefaultOptions(jobname,endpoint)
{
	var options = {
        url: "http://162.222.180.32:8080/job/"+jobname+"/api/"+endpoint,
        auth:{
            user : jenkins_config.username,
            password : jenkins_config.token
        }

	};
	return options;
}

function getBotwaOptions()
{
    var options = {
        url: botwa_config.url,
    };
    return options;
}

function post_to_botwa(current_build_number, current_build_status)
{
    var options = getBotwaOptions();
    //console.log(current_build_number);
    //console.log(options);
    request.post(botwa_config.url, { json: [{build_no:current_build_number},{build_status:current_build_status}] }, function(error, response, body){
        if (error) {
            console.error(error)
            return
          }
        });
}

async function get_job(jobname,endpoint)
{
    var options = getDefaultOptions(jobname,endpoint);
    //console.log(options);
    request(options, function(error, response, body){
        //console.log(options)
        if (!error && response.statusCode == 200) {
            //console.log(body)
            obj = JSON.parse(body);
            current_build_number = obj.lastBuild.number;
            current_build_status = obj.color;
            //console.log(current_build_status)
            //console.log(obj.lastBuild.url);
            // console.log(obj) // Print the json
            post_to_botwa(current_build_number,current_build_status);
          }
        });
}

get_job(jenkins_config.project_name,"json?pretty=true");