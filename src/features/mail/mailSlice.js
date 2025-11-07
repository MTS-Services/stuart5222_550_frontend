const initialState = {
  templates: [],
  isLoading: false,
  isError: null,
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.isError = action.payload;
    },
  },
});

export const { setTemplates, setLoading, setError } = mailSlice.actions;

export default mailSlice.reducer;
