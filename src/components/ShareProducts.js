import { useHistory } from "react-router-dom";

import { Button } from "./styled/styled";

const ShareProducts = () => {
  const history = useHistory();

  return (
    <div>
      <Button onClick={() => history.push("/add-product")}>Share</Button>
    </div>
  );
};

export default ShareProducts;
