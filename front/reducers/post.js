import shortId from 'shortid';
import { produce } from 'immer';
import { faker } from '@faker-js/faker';

export const initialState = {
  // 더미데이터
  mainPosts: [{
    id: '1',
    User: {
      id: '1',
      nickname: '제로초',
    },
    content: '첫번째 게시글 #해시태그 #익스프레스',
    Images: [{
      id: shortId.generate(),
      src: 'https://edit.org/images/cat/book-covers-big-2019101610.jpg',
    }, {
      id: shortId.generate(),
      src: 'https://kr-mb.theepochtimes.com/assets/uploads/2020/09/Mountain-Bluebird-34540-700x420.jpg',
    }, {
      id: shortId.generate(),
      src: 'https://kr-mb.theepochtimes.com/assets/uploads/2020/09/Mountain-Bluebird-34540-700x420.jpg',
    }],
    Comments: [{
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: 'nero',
      },
      content: '첫 댓',
    }, {
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: 'hero',
      },
      content: '두 댓',
    }],
  }],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

initialState.mainPosts = initialState.mainPosts.concat(
  Array(20).fill().map(() => ({
    id: shortId.generate(),
    User: {
      id: shortId.generate(),
      nickname: faker.person.fullName(),
    },
    content: faker.lorem.paragraph(),
    Images: [{
      id: shortId.generate(),
      src: faker.image.url(),
    }, {
      id: shortId.generate(),
      src: faker.image.url(),
    }, {
      id: shortId.generate(),
      src: faker.image.url(),
    }],
    Comments: [{
      User: {
        id: shortId.generate(),
        nickname: faker.person.fullName(),
      },
      content: faker.lorem.sentence(),
    }],
  })),
);

export const ADD_POST_REQUEST = 'ADD_POST_REQUSET';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUSET';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUSET';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummpyPost = (data) => ({
  id: data.id,
  User: {
    id: '1',
    nickname: '제로초',
  },
  content: data.content,
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: '1',
    nickname: `제로초`,
  },
});

// 이전 상태를 액션을 통해 다음 상태로 만드는 함수(불변성을 지키면서)
const reducer = (state = initialState, action) => {
  // immer 사용: state 대신 draft
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.mainPosts.unshift(dummpyPost(action.data));
        draft.addPostLoading = false;
        draft.addPostDone = true;
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        // 복사할 필요는 없지만 filter가 편해서
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
