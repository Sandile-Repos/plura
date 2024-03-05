import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const agencyId = await verifyAndAcceptInvitation();
  console.log(agencyId);

  //get users details
  const user = await getAuthUserDetails();
  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      //To connect any user stripe account in our application there is a rediect url
      //However there is no way to have dynamic path as return url, we have static url, so we have to send user back to agency page than reroute to specific agency id we trying to reconnect
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0]; // three underscores(___)
        const stateAgencyId = searchParams.state.split("___")[1]; // three underscores(___)
        if (!stateAgencyId) return <div>Not authorised</div>;
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not authorised</div>;
    }
  }
  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl"> Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default Page;

//We will first search to see if we have an agencyid and if we dont we send him to creation page and if it do we send him to the page
