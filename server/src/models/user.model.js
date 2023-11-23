import User from "./user.mongo.js";

async function saveUser(userId, kakaoAccount) {
  try {
    const { nickname, thumbnail_image_url } = kakaoAccount.profile;

    const userInstance = new User({
      id: userId,
      userName: nickname,
      userAvatar: thumbnail_image_url,
    });

    const filter = { id: userInstance.id };
    const update = {
      $set: {
        id: userInstance.id,
        userName: userInstance.userName,
        userAvatar: userInstance.userAvatar,
      },
    };

    await User.updateOne(filter, update, { upsert: true });
  } catch (error) {
    console.error("Could not save user", error);
    throw error;
  }
}

async function findUserBy(userId) {
  try {
    return await User.findOne({ id: userId }, { _id: 0, __v: 0 });
  } catch (error) {
    console.error("Could not find user", error);
    throw error;
  }
}

export { saveUser, findUserBy };
