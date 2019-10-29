// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
<<<<<<< HEAD
var request = require('sync-request');
let APIKEY = "e7c08c6236afd4f414023bbc6db15ae2";
let baseURL = 'https://api.themoviedb.org/3/';
=======

let APIKEY = "e7c08c6236afd4f414023bbc6db15ae2";
let baseURL = 'https://api.themoviedb.org/3/';
var request = require('sync-request');

>>>>>>> 7e6e3cf8fa097bd59a72b5da49b60cc547163d0c

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Movie Reviews, tell me what do you need?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const PedirReviewIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PedirReviewIntent';
    },
    handle(handlerInput) {
<<<<<<< HEAD
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let movie = slots['movie'].value;
        var res = request('GET', baseURL + 'search/movie?api_key=' + APIKEY + '&query=' + movie);
        var json = JSON.parse(res.getBody());
        var number = json.total_results;
        let speakOutput = "I'm sorry, I could'nt find that movie.";
        if (number <= 0) {
            return handlerInput.responseBuilder
=======
        let movieName = 'starwars';
        let res = request('GET', baseURL + 'search/movie?api_key=' + APIKEY + '&query=' + movieName);
        let num = JSON.parse(res.getBody());
        const speakOutput = num.results[0].id;
        return handlerInput.responseBuilder
>>>>>>> 7e6e3cf8fa097bd59a72b5da49b60cc547163d0c
            .speak(speakOutput)
            .reprompt()
            .getResponse();
        }
        let id = json.results[0].id;
        var reviewRes = request('GET', baseURL + 'movie/' + id + '/reviews?api_key=' + APIKEY + '&language=en-US');
        var jsonReview = JSON.parse(reviewRes.getBody());
        if (jsonReview.total_results <= 0) {
            return handlerInput.responseBuilder
            .speak("I'm sorry, I could'nt find any review for that movie.")
            .reprompt()
            .getResponse();
        }
        speakOutput = 'This is one review of ' + json.results[0].title + ', ' + jsonReview.results[0].content;
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
        PedirReviewIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
