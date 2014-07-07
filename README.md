# Barkley Partner Finder

This application was Sierra Paller's idea after she took the [Wild Internet of Things](https://github.com/joelongstreet/internet-of-wild-things) class at Barkley. The goal of the app is to track the location of a specific employee by pressing a physical button.

*Pictures coming soon*

## Rest Routes
User calendars can be consumed via rest routes with the pattern `partner/:email-address`. Query params can be passed to limit the amount of items returned, `partner/:email-address?location&floor`

## Authenticating
To be tracked by the partner finder, you need to first hit the authentication route located at [http://partner-finder.herokuapp.com](http://partner-finder.herokuapp.com). This builds a user record with an oAuth2 access and refresh token.

## Environment Variables
* `ROOT_URL` - Used for the google auth callback
* `DB_CONNECT` - The Full mongo connection string:  `mongodb://{mongo_username}:{mongo_password}@{mongo_url}
* `GOOGLE_CLIENT_ID` - Google app client id
* `GOOGLE_SECRET` - Google app secret
* `SPARK_ACCESS_TOKEN`
* `SPARK_CORE_ID`
