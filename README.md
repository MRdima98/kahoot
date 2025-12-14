# Kahoot
Kahoot is a quiz game used to teach children or to have fun during a bachelor party.
My use case is the latter, this is a custom remake of the game specifically made for my girlfriend.

## Example
![Alt Text](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXEwZzd3MjlhY3l2eTc0bzI1cjB4MDNtaDhrdjYyN3Fpb3pib3J1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FhkbUHgFQbAv4I3COq/giphy.gif)

## How to use? 
You need node and bun. Start next and socket_server.ts
```
bun build
bun start
```
in another terminal 
```
bun run socket_server.ts
```
The player is under http://localhost:3000 while the game is under http://localhost:3000/game.

If you want to deploy remember to change the links with your correct domains in https and wss.

## Customize
You can customize the game for you by changing the following files:
- database.json for the questions
- pictures for the pictures inside the questions
- svgs to change the icons of the answers

## Gotchas
Players should join after the /game page loaded.
Players can join at any moment, but if they leave and rejoin points are reset.
Any correct answer is 100 points, otherwise it's 0 points. It takes 5 seconds to go to the next question,
this is needed to give time to read the scoreboard.

## Shortcomings
Unfortunately there is a bug, when you enter the last scoreboard it will flash the last 
question every 3 seconds.
I don't wish to fix it as now, since I learned enough about web sockets and nextjs, I feel satisfied.
