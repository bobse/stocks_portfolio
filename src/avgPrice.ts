interface Transaction {
  date: Date;
  stock: string;
  amount: number;
  price: number;
  fees: number;
  extraInfo?: string;
}

interface PrevValues {
  currAmount: number;
  currAvgPrice: number;
}

// only recalculate this when deleting a transaction and there are other transactions with newer dates than the one that has been deleted
function averagePrice(prevValues: PrevValues, stock: Transaction) {
  const newTotalAmount: number = prevValues.currAmount + stock.amount;
  if (newTotalAmount === 0) {
    return { currAvgPrice: 0, currAmount: 0 };
  }
  if (stock.amount <= 0) {
    return prevValues;
  }
  return {
    currAvgPrice:
      (stock.amount * stock.price +
        prevValues.currAvgPrice * prevValues.currAmount) /
      newTotalAmount,
    currAmount: newTotalAmount,
  };
}

const transactions: Transaction[] = [
  {
    date: new Date(),
    stock: "RAIZ4",
    amount: 100,
    price: 10,
    fees: 0.2,
  },
  {
    date: new Date(),
    stock: "RAIZ4",
    amount: -100,
    price: 10,
    fees: 0.2,
  },
  {
    date: new Date(),
    stock: "RAIZ4",
    amount: 100,
    price: 15,
    fees: 0.2,
  },
];

const initialValue: PrevValues = { currAvgPrice: 0, currAmount: 0 };
console.log(transactions.reduce(averagePrice, initialValue));
