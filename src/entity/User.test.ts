import { describe, it } from "mocha";
import { expect } from "chai";
import { User } from ".";
import {
    UsernameEmptyError,
    UsernameStartsOrEndsWithWhitespaceError,
    UsernameTooShortError,
    UsernameTooLongError,
    UsernameContainsInvalidCharaterError
} from "./User";


describe("Entity/User", () => {
    it("#validateUsername", () => {
        const validate = User.validateUsername;

        expect(validate("")).to.be.an.instanceof(UsernameEmptyError);

        [
            " ",
            "a ",
            " b"
        ].forEach(kase => {
            expect(validate(kase)).to.be.an.instanceof(UsernameStartsOrEndsWithWhitespaceError);
        });

        expect(validate("t")).to.be.an.instanceof(UsernameTooShortError);

        const tooLongUsername = "TooLongUsernameTooLongUsernameTooLongUsername";
        expect(validate(tooLongUsername)).to.be.an.instanceof(UsernameTooLongError);

        [
            "^",
            "~",
            "!",
            "@",
            ":",
            "/",
            "\\",
            "<",
            ">",
            "\"",
            "|",
            "*",
            "?",
            "$",
            "\u0000"
        ].map(kase => "leftPadding" + kase).forEach(kase => {
            expect(validate(kase)).to.be.an.instanceof(UsernameContainsInvalidCharaterError);
        });

        [
            "lightyears1998",
            "good_user_name",
            "Tommas Hiller"
        ].forEach(kase => {
            expect(validate(kase)).to.be.true;
        });
    });

    it("#validateEmail", () => {
        const validate = User.validateEmail;

        [
            ".",
            "@host.com",
            "lightyears",
            "lightyears@qfstudio"
        ].forEach(kase => {
            expect(validate(kase), kase).to.be.false;
        });

        ["lightyears@QFSTUDIO.net", "Lightyears@qfstudio.net"].forEach(kase => {
            expect(validate(kase), kase).to.be.true;
        });
    });
});
