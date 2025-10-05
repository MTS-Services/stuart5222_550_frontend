import { RiDeleteBinLine } from "react-icons/ri";

export const Yoursafety = () => {
  return (
    <div className="">
      <div className="bg-[#FFFFFF33] p-5 rounded-lg my-8">
        <p className="font-normal text-lg">
          Your safety is what inspired us. You don’t know anything about the
          person you or your friend have given the card to. Please be smart
          about what information you share. Choose a means that gives you a
          level of protection - ie: a unique email and dedicated phone number
          (google voice){" "}
        </p>
      </div>
      <p className="font-medium text-xl md:my-14 my-4 px-3 md:py-8 py-6">
        If you can’t find your person with 50 cards, you’ll need to order more
        cards from us. There’s a re-order card included in your original card
        order, so be sure not to hand that one out.
      </p>

      <div className="px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-10">
        <RiDeleteBinLine className="w-14 h-14 text-[#FF5E00]" />
        <p className="font-normal text-base">
          Your cards will be sent to you after your profile has been approved
          for not violating decency standards. Once the cards are mailed to you,
          we delete your information
        </p>
      </div>
    </div>
  );
};