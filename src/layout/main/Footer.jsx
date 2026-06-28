import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../../components/common/CustomModal";
import { getCurrentYear, TERMS_LAST_UPDATED } from "../../utils/formatDate";

const Footer = () => {
  const currentYear = getCurrentYear();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  return (
    <div className="bg-[#505050] px-4 py-6 font-raleway md:py-10 lg:py-16">
      <div className="mx-auto max-w-[600px]">
        {/* Feature header */}
        <div className="flex flex-col items-start justify-start gap-4 self-stretch">
          <img
            className="h-14 w-20 object-cover"
            src="/img/assets/logo.png"
            alt="Feature illustration"
          />

          <p className="font-raleway text-xl font-semibold text-white">
            Person to person dating, but with a safer approach.
          </p>
        </div>

        <hr className="mt-2 border-t border-gray-500" />

        {/* Copyright & Legal */}
        <div className="space-y-4">
          <p className="mt-4 font-raleway font-normal leading-6 text-neutral-200">
            © {currentYear}{" "}
            <span className="font-raleway text-orange-400">
              SCAN ME MAYBE -
            </span>
          </p>

          <p className="font-raleway text-xs font-normal leading-3 text-neutral-200">
            Scan Me Maybe™ is a trademark of Scan Me Maybe, LLC. All Rights
            Reserved.
          </p>

          {/* Links */}
          <p
            className="cursor-pointer text-xs text-stone-300 underline transition-colors hover:text-orange-400"
            onClick={openTermsModal}
          >
            Terms & Conditions
          </p>
          {/* <p className="text-xs text-stone-300 underline">Privacy Policy</p> */}
          {/* <p className="cursor-pointer text-xs text-stone-300 underline">
            <Link to="/auth/login">Access Admin</Link>
          </p> */}
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <CustomModal
        isOpen={isTermsModalOpen}
        onClose={closeTermsModal}
        title="Terms & Conditions"
        size="xl"
      >
        <div className="max-h-96 overflow-y-auto bg-[#3B3B3D] p-4 text-sm text-white">
          <div className="">
            <h3 className="mb-1 text-lg font-bold text-orange-400">
              Scan Me Maybe – Terms &amp; Conditions
            </h3>
            <p className="mb-1 text-xs text-gray-400">Controlled Beta Version – {TERMS_LAST_UPDATED} &nbsp;|&nbsp; Version 1.0 Beta</p>

            <p className="mb-4 leading-relaxed text-white">
              Welcome to Scan Me Maybe. This platform exists to help create thoughtful introductions through QR-powered curiosity, controlled sharing, and the occasional leap of courage. By using Scan Me Maybe, you agree to these Terms &amp; Conditions and to behaving like a reasonably decent human being while you're here.
            </p>

            <div className="space-y-6">

              {/* Section 1 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">1. Beta Platform Notice</h4>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe is currently operating as a controlled beta platform. That means:</p>
                <ul className="mb-2 list-disc space-y-1 pl-5 text-white">
                  <li>features may evolve,</li>
                  <li>workflows may change,</li>
                  <li>bugs may exist,</li>
                  <li>and portions of the platform may occasionally be modified, paused, reset, updated, or improved as testing continues.</li>
                </ul>
                <p className="leading-relaxed text-white">Beta access may be limited and invitation-only. Participation in beta is voluntary and at your own discretion. We appreciate your patience while we continue building, refining, and occasionally untangling digital spaghetti behind the scenes.</p>
              </div>

              {/* Section 2 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">2. Eligibility</h4>
                <p className="mb-2 leading-relaxed text-white">You must be at least 18 years old to use Scan Me Maybe. By using the platform, you confirm that:</p>
                <ul className="mb-2 list-disc space-y-1 pl-5 text-white">
                  <li>you are legally permitted to use the service,</li>
                  <li>all information you provide is truthful,</li>
                  <li>and you are using the platform for lawful purposes only.</li>
                </ul>
                <p className="leading-relaxed text-white">No exceptions. No "but I'm mature for my age." Nope.</p>
              </div>

              {/* Section 3 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">3. Profile Approval &amp; Moderation</h4>
                <p className="mb-2 leading-relaxed text-white">All profiles, photos, and submitted content are reviewed before activation. Scan Me Maybe LLC reserves the right to:</p>
                <ul className="mb-2 list-disc space-y-1 pl-5 text-white">
                  <li>approve, deny, reject, pause, suspend, remove,</li>
                  <li>or request edits to any account, profile, image, or content at any time.</li>
                </ul>
                <p className="leading-relaxed text-white">If users edit approved profiles or upload new photos, profiles may automatically return to "Pending Review" status until reapproved. This platform is intentionally moderated. Please don't make moderation harder than it needs to be.</p>
              </div>

              {/* Section 4 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">4. Honest Profiles Only</h4>
                <p className="mb-2 leading-relaxed text-white">Profiles must accurately represent the person using the account. Photos should be recent, reasonably accurate, and clearly identify the member. We strongly encourage solo photos whenever possible.</p>
                <p className="mb-2 leading-relaxed text-white">No fake profiles, impersonation, stolen photos, intentionally misleading information, or pretending to be someone you're not.</p>
                <p className="leading-relaxed text-white">Please don't catfish people. This is Scan Me Maybe, not CSI: Emotional Damage Unit.</p>
              </div>

              {/* Section 5 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">5. Privacy &amp; Photo Protection</h4>
                <p className="mb-2 leading-relaxed text-white">Uploaded images may automatically have GPS data removed, metadata stripped, EXIF information deleted, and other embedded location information removed.</p>
                <p className="leading-relaxed text-white">While we take privacy seriously, no online platform can guarantee absolute security. Users are encouraged to protect personal information, use good judgment, and maintain healthy communication boundaries. Internet safety is still a thing. Please act accordingly.</p>
              </div>

              {/* Section 6 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">6. QR Code Usage</h4>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe QR codes are intended for limited and intentional sharing. QR codes may expire, deactivate, pause, or stop functioning after a limited number of scans.</p>
                <p className="mb-2 leading-relaxed text-white">Attempting to duplicate codes, bypass scan limitations, scrape profiles, automate access, or abuse platform functionality may result in immediate account suspension or removal.</p>
                <p className="leading-relaxed text-white">Please scan responsibly. This is a connection platform, not a QR scavenger hunt.</p>
              </div>

              {/* Section 7 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">7. Communication &amp; Travel Mode</h4>
                <p className="mb-2 leading-relaxed text-white">Members choose how they wish to be contacted. Users may update communication preferences, profile visibility, travel settings, and visible locations while using the platform.</p>
                <p className="mb-2 leading-relaxed text-white">Members may activate Travel Mode to update their visible location while traveling — including internationally. Travel Mode allows members to share where they'll be exploring so connections are not limited to their home location.</p>
                <p className="mb-2 leading-relaxed text-white">Because sometimes life takes you to Paris. Sometimes it takes you to Boise. And occasionally both decisions deserve equal optimism.</p>
                <p className="leading-relaxed text-white">Scan Me Maybe strongly recommends using privacy-focused communication methods whenever possible. We are not responsible for unwanted messages, ghosting, awkward conversations, emotionally confusing situations, or painfully low-effort pickup attempts.</p>
              </div>

              {/* Section 8 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">8. Respectful Conduct</h4>
                <p className="mb-2 leading-relaxed text-white">Users agree not to harass, threaten, stalk, spam, exploit, impersonate, manipulate, or abuse other members. Hate speech, predatory behavior, illegal activity, and abusive conduct are strictly prohibited.</p>
                <p className="leading-relaxed text-white">If your behavior turns the platform into a walking red flag convention, we reserve the right to remove you.</p>
              </div>

              {/* Section 9 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">9. Assumption of Risk</h4>
                <p className="mb-2 leading-relaxed text-white">By using Scan Me Maybe, users acknowledge and assume all risks associated with communications, introductions, interactions, meetings, and relationships initiated through the platform.</p>
                <p className="leading-relaxed text-white">Users are solely responsible for their decisions and personal safety. Please use common sense. Meet safely. Trust your instincts.</p>
              </div>

              {/* Section 10 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">10. No Guarantees</h4>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe does not guarantee matches, chemistry, responses, compatibility, relationships, soulmates, wedding bells, or that your QR code will unlock the love story Netflix eventually turns into a limited series.</p>
                <p className="leading-relaxed text-white">Participation in the platform does not guarantee that other users will respond, engage, or pursue a connection. Humans are complicated. We're simply helping the introduction happen.</p>
              </div>

              {/* Section 11 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">11. Safety, Screening &amp; User Responsibility</h4>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe is designed to facilitate introductions between people — not to certify, guarantee, investigate, supervise, referee, babysit, or magically determine whether somebody is emotionally available, relationship-ready, financially responsible, or capable of replying to a text message within less than three business days.</p>
                <p className="mb-2 leading-relaxed text-white">While profiles may be manually reviewed and approved before activation, approval simply means the submitted profile appears to comply with Scan Me Maybe LLC platform guidelines and moderation standards at the time of review. That review generally focuses on removing illegal content, removing explicit adult content, reducing obviously fake or misleading submissions, maintaining platform consistency, and helping preserve the intended user experience and safety standards of the platform.</p>
                <p className="mb-2 leading-relaxed text-white">Approval does NOT mean: criminal background checked, identity verified, emotionally stable, truthful, free from questionable judgment, capable of healthy communication, or guaranteed not to disappear after two promising conversations and a shared love of tacos.</p>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe LLC does not conduct criminal background checks, financial screening, behavioral screening, identity verification, or lifestyle investigations unless explicitly stated otherwise.</p>
                <p className="mb-2 leading-relaxed text-white">Users are solely responsible for exercising their own judgment, caution, instincts, and personal safety when interacting with others through the platform — both online and offline. All meetings, conversations, communications, interactions, and relationships initiated through Scan Me Maybe occur entirely at the user's own risk.</p>
                <p className="mb-2 leading-relaxed text-white">We strongly encourage meeting in public places, protecting personal information, using secondary communication methods such as Google Voice, telling a friend where you're going, and remembering that chemistry and common sense should ideally coexist.</p>
                <p className="mb-2 leading-relaxed text-white">Trust your instincts. And maybe choose a public coffee shop over an abandoned parking lot at 2am.</p>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe LLC reserves the right - but not the obligation - to review, approve, reject, suspend, remove, pause, or terminate profiles, accounts, QR access, or participation at any time and for any reason deemed necessary to protect the platform, users, beta process, or overall community experience.</p>
                <p className="mb-2 leading-relaxed text-white">We are building a platform for real-world connection.</p>
                <p className="leading-relaxed text-white">We are not issuing human warranties.</p>
              </div>

              {/* Section 12 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">12. Platform Rights &amp; Account Statuses</h4>
                <p className="mb-2 leading-relaxed text-white">Profiles may exist in statuses including: Pending, Active, Awaiting Corrections, Paused, Rejected, or Expired.</p>
                <p className="leading-relaxed text-white">Scan Me Maybe LLC reserves the right to modify platform functionality, update workflows, limit access, pause profiles, or discontinue portions of the platform at any time. Software is a living organism. We're continuing to improve things.</p>
              </div>

              {/* Section 13 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">13. Intellectual Property</h4>
                <p className="mb-2 leading-relaxed text-white">All platform branding, logos, workflows, QR systems, written materials, operational concepts, and original platform content associated with Scan Me Maybe remain the property of Scan Me Maybe LLC unless otherwise stated.</p>
                <p className="leading-relaxed text-white">By uploading content, users grant Scan Me Maybe LLC a limited, non-exclusive license to host and display such content solely for operation of the platform. Please don't steal our stuff. That creates paperwork.</p>
              </div>

              {/* Section 14 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">14. Limitation of Liability</h4>
                <p className="mb-2 leading-relaxed text-white">Scan Me Maybe LLC is not liable for user behavior, off-platform interactions, communications, disputes, meetings, relationship outcomes, emotional distress, awkward first dates, or questionable life decisions made after scanning a QR code.</p>
                <p className="leading-relaxed text-white">To the maximum extent permitted by law, platform liability shall be limited to amounts paid directly to the platform, if any.</p>
              </div>

              {/* Section 15 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">15. Dispute Resolution</h4>
                <p className="mb-2 leading-relaxed text-white">Any disputes arising from use of the platform shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, in Ravalli County, Montana, unless otherwise required by law.</p>
                <p className="mb-2 leading-relaxed text-white">By using the platform, users agree to waive participation in class-action lawsuits or class-wide proceedings against Scan Me Maybe LLC.</p>
                <p className="leading-relaxed text-white">Translation: If things go sideways, we handle it like adults — not with a reality TV reunion special.</p>
              </div>

              {/* Section 16 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">16. Governing Law</h4>
                <p className="leading-relaxed text-white">These Terms &amp; Conditions are governed by the laws of the State of Montana and applicable laws of the United States.</p>
              </div>

              {/* Section 17 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">17. Updates to Terms</h4>
                <p className="leading-relaxed text-white">These Terms &amp; Conditions may be updated periodically as the platform evolves. Continued use of the platform constitutes acceptance of updated Terms. Archived versions of prior Terms may be maintained internally for operational and legal continuity purposes.</p>
              </div>

              {/* Section 18 */}
              <div>
                <h4 className="mb-2 font-bold text-orange-400">18. Contact</h4>
                <p className="mb-2 leading-relaxed text-white">Questions, support requests, or concerns may be directed to:</p>
                <p className="font-semibold text-orange-300">info@scanmemaybe.com</p>
              </div>

              {/* Footer note */}
              <div className="rounded-lg border-l-4 border-orange-400 bg-[#505050] p-4">
                <p className="leading-relaxed text-orange-200">
                  Thank you for being part of Scan Me Maybe.<br />
                  Be respectful. Be honest. Be interesting.<br />
                  And maybe… just maybe… scan responsibly.
                </p>
              </div>

              <p className="text-center text-xs text-gray-300">
                <hr className="border-1 mb-4 border-gray-600" />
                Last updated: {TERMS_LAST_UPDATED} &nbsp;|&nbsp; Version 1.0 Beta
                <br />© {currentYear} Scan Me Maybe, LLC. All Rights Reserved.
              </p>

            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default Footer;
