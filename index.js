// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

let APIKEY = "e7c08c6236afd4f414023bbc6db15ae2";
let baseURL = 'https://api.themoviedb.org/3/';
var request = require('sync-request');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Movie Review, tell me if you want a review, rating or overview follow by the movie title?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OverviewIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OverviewIntent';
    },
    handle(handlerInput) {
        var speakOutput = "Sorry, I didn't find any movie with that name?";
        let movieOriginalTitle;
        let movieID;
        let runtime;
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let movieTitle = slots['overview'].value;
        let movieRuntime = slots['runtime'].value;
        if (typeof movieTitle !== 'undefined') { // give runtime and overview
            let res = request('GET', baseURL + 'search/movie?api_key=' + APIKEY + '&query=' + movieTitle);
            let movieObj = JSON.parse(res.getBody());
            let movieOverview = movieObj.results[0].overview;
            movieOriginalTitle = movieObj.results[0].original_title;
            movieID = movieObj.results[0].id;
            
            for (let i = 1; i < movieObj.total_results && movieOverview.length < 5; i++) {
                movieOverview = movieObj.results[i].overview;
                movieID = movieObj.results[i].id;
                movieOriginalTitle = movieObj.results[i].original_title;
            }
            
            if (movieOverview.length < 5) {
                speakOutput = "The movie " + movieOriginalTitle.replace(/&/g, '') + " doesn't have an overview.";
            } else {
                res = request('GET', baseURL + 'movie/' + movieID + '?api_key=' + APIKEY + '&language=en-US')
                movieObj = JSON.parse(res.getBody());
                runtime = movieObj.runtime;
                if (runtime === null) {
                    speakOutput = "For " + movieOriginalTitle.replace(/&/g, '') + ", the runtime. i don't know, but its overview is. " + movieOverview;
                } else {
                    speakOutput = "For " + movieOriginalTitle.replace(/&/g, '') + ", the runtime is: " + runtime +  " minutes, and its overview is. " + movieOverview;
                }
            }
        } else if (typeof movieRuntime !== 'undefined') { // only give runtime
            let res = request('GET', baseURL + 'search/movie?api_key=' + APIKEY + '&query=' + movieRuntime);
            let movieObj = JSON.parse(res.getBody());
            
            movieID = movieObj.results[0].id;
            
            movieOriginalTitle = movieObj.results[0].original_title;
            
            res = request('GET', baseURL + 'movie/' + movieID + '?api_key=' + APIKEY + '&language=en-US')
            movieObj = JSON.parse(res.getBody());
            runtime = movieObj.runtime;
            
            if (runtime === null) {
                speakOutput = "I haven't seen " + movieOriginalTitle + ", you can figure it out.";
            } else {
                speakOutput = "For " + movieOriginalTitle.replace(/&/g, '') + ", the runtime is: " + runtime +  " minutes.";
            }
        }
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
        
    }
};

const ReviewIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReviewIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let movie = slots['movie'].value;
        let speakOutput = "I didn't quite get that, try again, please."
        let review;
        var jsonReview
        if (typeof movie !== 'undefined'){
            var res = request('GET', baseURL + 'search/movie?api_key=' + APIKEY + '&query=' + movie);
            var json = JSON.parse(res.getBody());
            var number = json.total_results;
            speakOutput = "I'm sorry, I couldn't find the movie " + movie;
            if (number > 0) {
                let id = json.results[0].id;
                var reviewRes = request('GET', baseURL + 'movie/' + id + '/reviews?api_key=' + APIKEY + '&language=en-US');
                review = reviewRes.getBody();
                jsonReview = JSON.parse(review);
                
                speakOutput = "I'm sorry, I couldn't find any review for the movie " + json.results[0].title.replace(/&/g, '');
                if (jsonReview.total_results > 0) {
                    for (let i  = 0; i < jsonReview.total_results; i++) {
                        if (!jsonReview.results[i].content.includes("&")) {
                            speakOutput = 'This is one review of '+ json.results[0].title + ', ' + jsonReview.results[i].content;
                            break;
                        }
                    }
                }
            }
        }
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt('Anything else?')
        .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        OverviewIntentHandler,
        ReviewIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
