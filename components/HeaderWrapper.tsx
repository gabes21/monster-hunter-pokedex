import { createClient } from "@/lib/supabase/server";
import Header from "./Header";
import { connection } from "next/server";

const HeaderWrapper = async () => {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Header isLoggedIn={!!user} />;
};

export default HeaderWrapper;
