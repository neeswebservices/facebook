const { Facebook, FacebookApiException } = require("facebook-nodejs-business-sdk");
const PIXI = require("pixi.js");

const accessToken = "<your_access_token>";
const appSecret = "<your_app_secret>";
const pageId = "<your_page_id>";
const postId = "<your_post_id>";
const keyword = "car";

const facebook = new Facebook({
  accessToken,
  appSecret,
});

const app = new PIXI.Application();

const car = new PIXI.Sprite(PIXI.Texture.from("car.png"));
car.x = 0;
car.y = app.screen.height / 2;

app.stage.addChild(car);

function updateScore(comment) {
  const message = comment.message.toLowerCase();
  if (message.includes(keyword)) {
    // Increment the score
    // Calculate the distance traveled based on the score
    const distance = score * 10;
    // Move the car forward by the calculated distance
    car.x += distance;
    // Reply to the comment with the new score
    const reply = `Your score is now ${score}!`;
    const commentId = comment.id;
    const params = { message: reply };
    facebook.api(`/${commentId}/comments`, "POST", params).catch((error) => {
      console.error(error);
    });
  }
}

function monitorComments() {
  const params = {
    fields: "id,from,message",
    order: "reverse_chronological",
    limit: 10,
  };
  facebook
    .api(`/${postId}/comments`, "GET", params)
    .then((response) => {
      response.data.forEach((comment) => {
        updateScore(comment);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

setInterval(monitorComments, 5000);
