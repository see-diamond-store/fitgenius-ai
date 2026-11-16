'use strict';
/* FITGENIUS AI - reference data: goals, foods, exercise library */
/* reference data */
var GOALS=['Lose fat','Build muscle','Maintain weight','Improve endurance'];
var LEVELS=['Beginner','Intermediate','Advanced'];
var DIETS=['No restriction','Vegetarian','Vegan','Eggetarian','Pescatarian','High protein'];
var GENDERS=['Prefer not to say','Female','Male'];
var ACT={'Sedentary':1.2,'Lightly active':1.375,'Moderately active':1.55,'Very active':1.725,'Extra active':1.9};
var GOAL_ADJ={'Lose fat':-450,'Build muscle':250,'Maintain weight':0,'Improve endurance':100};
var MEALS=['Breakfast','Lunch','Dinner','Snacks'];
var FOODS=[['Oats with milk','1 bowl',310,12,48,7],['Scrambled eggs','2 eggs',190,13,2,14],['Banana','1 medium',105,1,27,0],['Greek yogurt','170 g',130,17,6,4],['Grilled chicken breast','150 g',250,46,0,5],['Brown rice','1 cup cooked',215,5,45,2],['Dal','1 bowl',180,10,28,3],['Roti','1 piece',100,3,18,2],['Paneer','100 g',265,18,4,20],['Salmon fillet','150 g',310,34,0,18],['Apple','1 medium',95,0,25,0],['Almonds','30 g',175,6,6,15],['Peanut butter toast','1 slice',220,8,20,12],['Whey protein shake','1 scoop',120,24,3,2],['Mixed vegetable salad','1 bowl',90,3,12,4],['Boiled potatoes','150 g',130,3,30,0],['Idli','2 pieces',130,4,28,1],['Pasta','1 cup cooked',220,8,43,1],['Avocado','half',160,2,9,15],['Milk','250 ml',150,8,12,8]];
var LIB=[
['Push-up','Strength','Chest, triceps, shoulders','Beginner','Place hands slightly wider than your shoulders with your body in a straight line.|Lower your chest toward the floor, elbows about 45 degrees from your body.|Press back up without letting your hips sag.'],
['Goblet Squat','Strength','Quads, glutes','Beginner','Hold a dumbbell at your chest with feet shoulder-width apart.|Sit your hips back and down until your thighs are about parallel.|Drive through your whole foot to stand up.'],
['Barbell Squat','Strength','Quads, glutes, core','Intermediate','Set the bar on your upper back and brace your core.|Squat down keeping your chest up and knees tracking over your toes.|Stand up powerfully and reset before the next rep.'],
['Bench Press','Strength','Chest, triceps','Intermediate','Lie on the bench with eyes under the bar and feet planted.|Lower the bar to mid-chest under control.|Press up until your arms are straight. Use a spotter for heavy sets.'],
['Deadlift','Strength','Hamstrings, glutes, back','Advanced','Stand with the bar over mid-foot and grip just outside your knees.|Brace, push the floor away and keep the bar close to your legs.|Lock out hips and knees together, then lower with control.'],
['Romanian Deadlift','Strength','Hamstrings, glutes','Intermediate','Hold the bar at hip height with a soft bend in the knees.|Push your hips back, sliding the bar down your thighs.|Stop at a hamstring stretch, then drive your hips forward.'],
['Pull-up','Strength','Back, biceps','Advanced','Hang from the bar with an overhand grip a little wider than your shoulders.|Pull your chest toward the bar by driving your elbows down.|Lower fully with control. Use a band if you need help.'],
['Dumbbell Row','Strength','Back, biceps','Beginner','Support one hand and knee on a bench with a dumbbell in the other hand.|Pull the weight toward your hip, keeping your back flat.|Lower slowly until your arm is straight.'],
['Dumbbell Shoulder Press','Strength','Shoulders, triceps','Beginner','Sit or stand with dumbbells at shoulder height.|Press overhead until your arms are straight.|Lower under control back to shoulder height.'],
['Walking Lunge','Strength','Quads, glutes','Beginner','Step forward and lower until both knees reach about 90 degrees.|Keep your torso tall and your front knee over the ankle.|Push through the front foot to step into the next lunge.'],
['Bicep Curl','Strength','Biceps','Beginner','Stand with dumbbells at your sides, palms forward.|Curl the weights up without swinging your torso.|Lower slowly to full extension.'],
['Bench Dip','Strength','Triceps, chest','Intermediate','Place your hands on a bench behind you with legs extended.|Bend your elbows to lower until upper arms are parallel to the floor.|Press back up, keeping your shoulders away from your ears.'],
['Jump Rope','Cardio','Calves, shoulders, heart','Beginner','Hold the handles at hip height with elbows close to your sides.|Turn the rope with your wrists and jump just high enough to clear it.|Land softly on the balls of your feet.'],
['Running','Cardio','Legs, heart','Beginner','Start with a 5-minute brisk walk to warm up.|Keep a pace where you could still hold a conversation.|Finish with a 5-minute walk and light stretching.'],
['Burpee','Cardio','Full body','Intermediate','From standing, place your hands on the floor and jump your feet back.|Do a push-up, then jump your feet forward.|Explode upward into a jump and repeat.'],
['Cycling','Cardio','Quads, glutes, heart','Beginner','Adjust the seat so your knee is slightly bent at the bottom of the pedal stroke.|Hold a steady cadence you can sustain.|Cool down with 5 minutes of easy pedalling.'],
['Mountain Climber','Cardio','Core, shoulders, legs','Intermediate','Start in a high plank with hands under your shoulders.|Drive one knee toward your chest, then switch quickly.|Keep your hips level and core braced.'],
['Plank','Core','Core, shoulders','Beginner','Rest on your forearms with elbows under your shoulders.|Keep a straight line from head to heels.|Squeeze glutes and abs and hold without letting your hips drop.'],
['Crunch','Core','Abs','Beginner','Lie on your back with knees bent and hands lightly behind your head.|Lift your shoulder blades off the floor using your abs.|Lower slowly without pulling on your neck.'],
['Russian Twist','Core','Obliques','Intermediate','Sit with knees bent and lean back slightly.|Rotate your torso side to side, moving the weight with you.|Keep your chest lifted and your back straight.'],
['Lying Leg Raise','Core','Lower abs, hip flexors','Intermediate','Lie flat with legs straight and hands under your hips.|Raise your legs to vertical while keeping your lower back pressed down.|Lower slowly without touching the floor.'],
['Cat-Cow','Mobility','Spine, core','Beginner','Start on hands and knees.|Arch your back and look up, then round it and tuck your chin.|Move slowly with your breathing.'],
['Hip Flexor Stretch','Mobility','Hip flexors, quads','Beginner','Kneel on one knee with the other foot forward.|Tuck your pelvis and shift your weight forward gently.|Hold 30 seconds, then switch sides.'],
['Child\'s Pose','Mobility','Back, hips, shoulders','Beginner','Kneel and sit your hips back toward your heels.|Reach your arms forward and rest your forehead down.|Breathe deeply for 30 to 60 seconds.']
];
var LIBN=LIB.map(function(e){return e[0]});
var CATS=['All','Strength','Cardio','Core','Mobility'];
