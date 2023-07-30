### To Install

1. Copy ```achievements.js``` to the QuestJS ```/lib``` directory
2. Add ```settings.customLibraries.push({folder:'lib',files:['achievements']})``` to ```settings.js```
3. Add ```achievements.persistAchievements()``` to the ```settings.setup``` function

### Functions
_createAchievement_
```javascript
  createAchievement({
    name:"unique_achievement_id",
    alias:"Cool Achievement Name!",
    details:"Message to display before achievement is completed",
    afterDetails:"Message to display after achievement is completed",
    condition:function(){
        return (w.player.did_a_cool_thing}))
    }
  })
```

_achievements.getAchievements_

Takes a boolean, returns a list of completed achievements when passed ```true``` and uncompleted achievements when passed ```false```

_achievements.getAllAchievements_

Returns a list of all possible achievements, sorted by name for uncompleted achievements and date achieved for completed achievements

_achievements.listAchievements_

Takes a list of achievements and prints them to the screen

☐ Uncompleted Achievement - This is what's in details!

☑ Completed Achievement - This is what's in afterDetails! - Sat Jul 29 2023
