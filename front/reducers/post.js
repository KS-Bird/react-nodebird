export const initialState = {
  // 더미데이터
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '제로초',
    },
    content: '첫번째 게시글 #해시태그 #익스프레스',
    Images: [{
      src: 'https://edit.org/images/cat/book-covers-big-2019101610.jpg',
    }, {
      src: 'https://kr-mb.theepochtimes.com/assets/uploads/2020/09/Mountain-Bluebird-34540-700x420.jpg',
    }, {
      src: 'https://kr-mb.theepochtimes.com/assets/uploads/2020/09/Mountain-Bluebird-34540-700x420.jpg',
    }],
    Comments: [{
      User: {
        nickname: 'nero',
      },
      content: '첫 댓',
    }, {
      User: {
        nickname: 'hero',
      },
      content: '두 댓',
    }],
  }],
  imagePaths: [],
  postAdded: false,
}

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
}
const dummpyPost = {
  id: 2,
  User: {
    id: 1,
    nickname: '제로초',
  },
  content: '더미데이터',
  Images: [],
  Comments: [],
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummpyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
}

export default reducer;