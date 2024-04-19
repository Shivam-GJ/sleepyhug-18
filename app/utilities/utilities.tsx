import {notifications} from "@mantine/notifications";
import type {ImageMetadata, Uuid} from "~/common--type-definitions/typeDefinitions";
import {getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import type {BlogAuthor, Capability, Industry} from "~/growth-jockey-common-typescript/typeDefinitions";
import {imageMetadataLibrary} from "~/imageMetadataLibrary";

export function getAuthorFromId(authorId: Uuid, authors: Array<BlogAuthor>): BlogAuthor {
    return getSingletonValue(authors.filter((author) => author.id == authorId));
}

// export function getAuthorFromIdSafe(authorId: Uuid, authors: Array<BlogAuthor>): BlogAuthor | null {
//     return safeExecute((input) => getSingletonValue(input), authors.filter(author => author.id == authorId));
// }

export function getIndustryFromId(industryId: Uuid, industries: Array<Industry>): Industry {
    if (industries.filter((industry) => industry.id == industryId).length == 0) {
        console.error("Industry not found: ", industryId);
    }
    return getSingletonValue(industries.filter((industry) => industry.id == industryId));
}

// export function getIndustryFromIdSafe(industryId: Uuid, industries: Array<Industry>): Industry | null {
//     return safeExecute((input) => getSingletonValue(input), industries.filter(industry => industry.id == industryId));
// }

export function getCapabilityFromId(capabilityId: Uuid, capabilities: Array<Capability>): Capability {
    if (capabilities.filter((capability) => capability.id == capabilityId).length == 0) {
        console.error("Capability not found: ", capabilityId);
    }
    return getSingletonValue(capabilities.filter((capability) => capability.id == capabilityId));
}

// export function getCapabilityFromIdSafe(capabilityId: Uuid, capabilities: Array<Capability>): Capability | null {
//     return safeExecute((input) => getSingletonValue(input), capabilities.filter(capability => capability.id == capabilityId));
// }

export function getMetadataForImage(relativePath: string) {
    const imageMetadata = imageMetadataLibrary[relativePath];

    if (imageMetadata != null) {
        return imageMetadata;
    }

    // throw new Error(`Image metadata not updated for image ${relativePath}`);
    console.error(`Image metadata not updated for image ${relativePath}`);
    // console.trace();

    const imageMetadata_: ImageMetadata = {
        width: 4,
        height: 3,
        finalUrl: relativePath,
    };

    return imageMetadata_;
}

export function convertStringToList(str: string): Array<string> {
    return str
        .trim()
        .split("\n")
        .map((str_) => str_.trim())
        .filter((str_) => str_.length > 0);
}

export function convertListToString(list: Array<string>): string {
    return list.join("\n");
}

export function agGridDateComparator(a: string, b: string) {
    const aa = new Date(a);
    const bb = new Date(b);
    if (aa > bb) {
        return 1;
    } else if (aa < bb) {
        return -1;
    } else {
        return 0;
    }
}

export function dateToMediumNoneEnFormat(date: string) {
    if (date == null) {
        return null;
    }

    return new Intl.DateTimeFormat("en", {timeZone: "Asia/Kolkata", dateStyle: "medium"}).format(new Date(date));
}

// TODO: Use this everywhere
export function showErrorToast(title: string, error: string) {
    // toast((toast_) => (
    //     // Info: react-hot-toast uses 1rem padding around the toasts container
    //     // TODO: Ensure this does not break on mobiles with 100vw < 1rem + 16rem + 1rem
    //     // TODO: Style the toasts container to ensure it does not break when using modals (using `width = 100vw` instead of `inset = 16px`)
    //     <div className="tw-w-64 tw-grid tw-grid-cols-[minmax(0,1fr)_auto]">
    //         <div className="tw-font-bold">
    //             {title}
    //         </div>

    //         <button
    //             type="button"
    //             onClick={toast_.closeToast}
    //         >
    //             <X className="tw-w-4 tw-h-4" />
    //         </button>

    //         <div className="tw-col-span-2">
    //             {error}
    //         </div>
    //     </div>
    // ), {
    //     className: "!tw-bg-red-600 !tw-text-white",
    // });

    notifications.show({
        title: title,
        message: error,
        color: "red",
    });
}
