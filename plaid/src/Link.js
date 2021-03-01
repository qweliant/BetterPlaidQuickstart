import React, { useState, useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";
import qs from "qs";

const tokenURL = `${process.env.REACT_APP_API}/api/create_link_token`;
const sendTokenURL = `${process.env.REACT_APP_API}/api/set_access_token`;

const  Link = () => {
  const [data, setData] = useState("");
  
  const fetchToken = useCallback(async () => {
    const config = {
      method: "post",
      url: tokenURL,
    };
    const res = await axios(config);
    console.log(res)
    setData(res.data.link_token);
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const onSuccess = useCallback(async (token, metadata) => {

    // send token to server
    const config = {
      method: "post",
      url: sendTokenURL,
      data: qs.stringify({ public_token: token }),
      headers: { "content-type": "application/json" },
    };
    try {
      const response = await axios(config);
      console.log(response)
    } catch (error) {
      console.error(error);
    }

  }, []);

  const config = {
    token: data,
    onSuccess,
  };

  const { open, ready, err } = usePlaidLink(config);

  if (err) return <p>Error!</p>;

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
    </div>
  );
}

export default Link;