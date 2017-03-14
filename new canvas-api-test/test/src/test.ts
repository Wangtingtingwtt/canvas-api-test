
// engine.Ticker.getInstance().register((deltaTime) => {
//     console.log("aaa")
//     bitmap.x += 1;
// });

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
var stage = engine.run(canvas);

let standFrame1: engine.MovieClipFrameData = { image: "npc1.jpg" };
let standFrames: engine.MovieClipFrameData[] = [standFrame1];
let standMovieClipData: engine.MovieClipData = { _name: "stand", _frames: standFrames };
let playerstand_mc: engine.MovieClip = new engine.MovieClip(standMovieClipData);

let walkFrame1: engine.MovieClipFrameData = { image: "npc2.jpg" };
let walkFrames: engine.MovieClipFrameData[] = [walkFrame1];
let walkMovieClipData: engine.MovieClipData = { _name: "walk", _frames: walkFrames };
let playerwalk_mc: engine.MovieClip = new engine.MovieClip(walkMovieClipData);

var PlayerContainer = new engine.DisplayObjectContainer();
PlayerContainer.addChild(playerstand_mc);
PlayerContainer.addChild(playerwalk_mc);

var m: StateMachine = new StateMachine(stage, playerstand_mc, playerwalk_mc, PlayerContainer);
playerstand_mc.play();
PlayerContainer.touchEnabled = true;
PlayerContainer.addEventListener("mousedown", (e) => {
    m.setState("move");
    playerwalk_mc.play();
    PlayerContainer.x++;
}, false)



stage.addChild(PlayerContainer);
