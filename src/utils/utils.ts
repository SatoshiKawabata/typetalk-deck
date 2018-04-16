export const node2Array = (nodeList: NodeList): Node[] => {
  const a = [];
  for (let i = 0; i < nodeList.length; i++) {
      a.push(nodeList[i]);
  }
  return a;
};

export const isAddedToTop = (addedList: Node[], nodeList: NodeList): boolean => {
  const list = node2Array(nodeList);
  return addedList.some(node => {
    return list.indexOf(node) === 0;
  });
};

export const classNames = (list: string[]): string => {
  let result = "";
  list.forEach(cn => {
    result += cn + " ";
  });
  return result;
};
