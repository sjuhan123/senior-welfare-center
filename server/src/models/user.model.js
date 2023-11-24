import User from "./user.mongo.js";
import { getWelfareByWelfareId } from "./welfares.model.js";

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
    return await User.findOne({ id: userId }, { _id: 0, __v: 0 }).populate(
      "bookmarkWelfares",
      "-__v"
    );
  } catch (error) {
    console.error("Could not find user", error);
    throw error;
  }
}

async function updateUserBookmarkWelfares(userId, bookmarkWelfares) {
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { bookmarkWelfares: bookmarkWelfares },
      { upsert: true }
    );
  } catch (error) {
    console.error("Could not update user bookmark welfares", error);
    throw error;
  }
}

async function bookmarkWelfare(userId, welfareId) {
  try {
    const user = await findUserBy(userId);
    const bookmarkedWelfares = user.bookmarkWelfares;

    const isBookmarked = bookmarkedWelfares.some(
      ({ _id }) => _id.toString() === welfareId
    );

    if (bookmarkedWelfares.length >= 2) {
      console.log("Maximum bookmarks reached");
      return;
    }

    if (!isBookmarked) {
      const welfareInstance = await getWelfareByWelfareId(welfareId);

      if (!welfareInstance) {
        throw new Error(`Welfare not found for ID: ${welfareId}`);
      }

      const updatedBookmarkedWelfares = [
        ...bookmarkedWelfares,
        welfareInstance._id,
      ];

      await updateUserBookmarkWelfares(userId, updatedBookmarkedWelfares);

      return welfareInstance.name;
    }
  } catch (error) {
    console.error("Could not bookmark welfare", error);
    throw error;
  }
}

async function unBookmarkWelfare(userId, welfareId) {
  try {
    const user = await findUserBy(userId);
    const bookmarkedWelfares = user.bookmarkWelfares;

    const isBookmarked = bookmarkedWelfares.some(
      ({ _id }) => _id.toString() === welfareId
    );

    if (isBookmarked) {
      const updatedBookmarkedWelfares = bookmarkedWelfares.filter(
        ({ _id }) => _id.toString() !== welfareId
      );

      await updateUserBookmarkWelfares(userId, updatedBookmarkedWelfares);

      return welfareId;
    } else {
      console.log("Welfare not found in user bookmark welfares");
      return;
    }
  } catch (error) {
    console.error("Could not delete bookmark welfare", error);
    throw error;
  }
}

export { saveUser, findUserBy, bookmarkWelfare, unBookmarkWelfare };
