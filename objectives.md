1. Allow for users to register/login
2. A main/landing page with hero section etc
3. Page where users can submit and track their bets.
4. Profile page that displays the upcoming and previous bets of the user as well as stats.
5. Users can add/edit/delete notes to their picks, but cannot edit/delete the picks.
6. Dashboard for users after they log in.
7. Event page for upcoming events/matches/games that show which users are picking/betting which side.
8. Leaderboard for users with highest ROI.
9. Settings page for users to edit/update their profile. 


I currently have a list of Users, MLBets, and Event Results. 
Each user should have a list of previous event results, and picks for upcoming events.
Each user should have stats associated with their profile which shows their win loss record, their profit and any additional stats.

I need to create a UserResults page/model to track a users betting stats. In order to do that, I will need to find all the bets/picks uploaded by the user and compare them to the event results. I will need to create a database for for each user, and all of their bets. If the bet has an event name that is also in EventResults, then that means the event has happened. 
In the UserStats page, I will need to get each User and all Bets with the ID associated with that user.
{
    user:
    mmaMLBets:[...{}] (array of objects(bets))
}
Then I will need to get the EventResults.
For each User, iterate over their bets, and find if mmaMLBets.event === eventResults.event