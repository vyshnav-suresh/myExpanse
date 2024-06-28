import { calculateCategoryAggregates, updateCategories } from "@/lib/functions";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// export const fetchProtocol = createAsyncThunk(
//   "reagents/fetchProtocol",
//   async () => {
//     // Fetch data from API
//     try {
//       const response = await axios.get(BASE_URL + "protocol/list");
//       return response.data;
//     } catch (error) {
//       throw Error(error.response.data.error);
//     }
//   }
// );
// export const addProtocol = createAsyncThunk(
//   "reagents/addProtocol",
//   async (data) => {
//     // Fetch data from API
//     try {
//       const response = await axios.post(BASE_URL + "protocol/save", {
//         name: data.name,
//         description: "",
//       });

//       return response.data;
//     } catch (error) {
//       throw Error(error.response.data.error);
//     }
//   }
// );
export const fetchExpense = createAsyncThunk(
  "expance/fetchExpense",
  async () => {
    // Fetch data from API
    try {
      const response: any = localStorage.getItem("excel");
      return response;
    } catch (error: any) {
      throw Error(error.response.data.error);
    }
  }
);
export const fetchKeywords = createAsyncThunk(
  "expance/fetchKeywords",
  async () => {
    // Fetch data from API
    try {
      const response: any = localStorage.getItem("keyword_category_mapping");

      return JSON.parse(response);
    } catch (error: any) {
      throw Error(error.response.data.error);
    }
  }
);
// export const addKeywords = createAsyncThunk(
//   "expance/addKeywords",
//   async (
//     data: { localStorageKey: string; localStorageValue: string },
//     thunkAPI
//   ) => {
//     // Fetch data from API
//     try {
//        const response: any = localStorage.getItem("keyword_category_mapping");

//        const updatedMapping = {
//          ...response,
//          [data.localStorageKey]: data.localStorageValue,
//        };
//       localStorage.setItem("keyword_category_mapping", JSON.stringify(data));
//       console.log("working add");

//       return updatedMapping;
//     } catch (error: any) {
//       throw Error(error.response.data.error);
//     }
//   }
// );
// export const deleteKeywords = createAsyncThunk(
//   "expance/deleteKeywords",
//   async (data: any) => {
//     // Fetch data from API
//     try {
//       const response: any = localStorage.setItem(
//         "keyword_category_mapping",
//         JSON.stringify(data)
//       );

//       return response;
//     } catch (error: any) {
//       throw Error(error.response.data.error);
//     }
//   }
// );
const getExpense: any = localStorage.getItem("excel");
const initialExpense = JSON.parse(getExpense);
const getKeywords: any = localStorage.getItem("keyword_category_mapping");
const initialKeywords = JSON.parse(getKeywords);
const getcategoryWise: any = localStorage.getItem("categorySums");
const initialcategoryWise = JSON.parse(getcategoryWise);

const totalAmount =
  initialExpense &&
  initialExpense.reduce(
    (
      sum: number,
      transaction: {
        date: string;
        description: string;
        amount: number;
        category: string;
      }
    ) => sum + transaction.amount,
    0
  );

const basicSlice = createSlice({
  name: "basic",
  initialState: {
    expense: initialExpense,
    basicloading: false,
    keywords: initialKeywords,
    categoryWise: initialcategoryWise,
    totalAmount: totalAmount,
  },
  reducers: {
    addKeywords(state: any, action) {
      const response: any = localStorage.getItem("keyword_category_mapping");
      const data = response ? JSON.parse(response) : {};

      const updatedMapping = {
        ...data,
        [action.payload.localStorageKey]: action.payload.localStorageValue,
      };

      localStorage.setItem(
        "keyword_category_mapping",
        JSON.stringify(updatedMapping)
      );
      // Ensure state.keywords is initialized
      if (!state.keywords) {
        state.keywords = {};
      }

      state.keywords[action.payload.localStorageKey] =
        action.payload.localStorageValue;
      if (state.expense) {
        state.expense = updateCategories(state.expense, state.keywords);
        state.categoryWise = calculateCategoryAggregates(state.expense);
      }
    },
    deleteKeywords(state: any, action) {
      const { [action.payload]: removedItem, ...rest } = state.keywords || {};
      console.log(action.payload, "delete");

      localStorage.setItem("keyword_category_mapping", JSON.stringify(rest));

      state.keywords = rest;
      state.expense = updateCategories(state.expense, state.keywords);
      state.categoryWise = calculateCategoryAggregates(state.expense);
      toast.success(`Item "${action.payload}" deleted successfully!`);
    },
    deleteAllKeywords(state: any) {
      localStorage.removeItem("keyword_category_mapping");
      state.keywords = {};
      state.expense = updateCategories(state.expense, state.keywords);
      toast.success(`Item deleted successfully!`);
    },
    addExpense(state: any, action) {
      state.expense = action.payload;
      state.expense = updateCategories(state.expense, state.keywords);
      state.totalAmount =
        state.expense &&
        state.expense.reduce(
          (
            sum: number,
            transaction: {
              date: string;
              description: string;
              amount: number;
              category: string;
            }
          ) => sum + transaction.amount,
          0
        );
    },
    updateCategorySum(state: any, action) {
      state.categoryWise = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchExpense.fulfilled, (state, action) => {
      state.basicloading = false;
      state.expense = action.payload ?? [];
    });
    builder.addCase(fetchExpense.pending, (state, action) => {
      state.basicloading = true;
    });
    builder.addCase(fetchKeywords.fulfilled, (state, action) => {
      state.basicloading = false;
      console.log("keyword_category_mapping", action.payload);

      if (action.payload) {
        state.keywords = action.payload ?? {};
        return;
      }
      // state.keywords = {
      //   fuel: "Fuel",
      //   grocery: "Grocery",
      //   hotel: "Hotel",
      //   restaurant: "Dining",
      //   petrol: "Fuel",
      // };
    });
    builder.addCase(fetchKeywords.pending, (state, action) => {
      state.basicloading = true;
    });

    //   .addCase(addProtocol.fulfilled, (state, action) => {
    //     state.loading = false;
    //      useDispatch(
    //        chooseProtocol({ id: action.payload.id, name: action.payload.name })
    //      );
    //     // console.log(state.reagents, "inside case");
    //   });
  },
});
export const {
  addKeywords,
  deleteKeywords,
  addExpense,
  deleteAllKeywords,
  updateCategorySum,
} = basicSlice.actions;

export default basicSlice;
