// Publishing Events
char publishString[64];
sprintf(publishString, "{ \"userId\": \"A%c\"}", userId);
Spark.publish("find-user", publishString);


// Listening
Spark.function("notify", notify);
int notify(String command)
{
  char userId = command.charAt(0);
  char floorNum = command.charAt(2);

  return 1;
}
