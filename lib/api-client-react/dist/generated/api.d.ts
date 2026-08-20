import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminCredentials, AdminSession, BulkCityImport, BulkImportCitiesCsvBody, BulkImportResult, BulkStateImport, City, CityInput, CityListResponse, CityUpdate, DashboardStats, HealthStatus, ListCitiesParams, ListListingsParams, Listing, ListingInput, ListingPage, ListingUpdate, SeoPage, SeoPageInput, SeoPageUpdate, SiteSettings, SiteSettingsUpdate, State, StateInput, StateUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (adminCredentials: AdminCredentials, options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminCredentials>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminCredentials>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminCredentials>;
export type AdminLoginMutationError = ErrorType<void>;
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminCredentials>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminCredentials>;
}, TContext>;
export declare const getAdminLogoutUrl: () => string;
/**
 * @summary Admin logout
 */
export declare const adminLogout: (options?: RequestInit) => Promise<void>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
* @summary Admin logout
*/
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export declare const getGetAdminMeUrl: () => string;
/**
 * @summary Get current admin session
 */
export declare const getAdminMe: (options?: RequestInit) => Promise<AdminSession>;
export declare const getGetAdminMeQueryKey: () => readonly ["/api/admin/me"];
export declare const getGetAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminMe>>>;
export type GetAdminMeQueryError = ErrorType<void>;
/**
 * @summary Get current admin session
 */
export declare function useGetAdminMe<TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardStatsUrl: () => string;
/**
 * @summary Get dashboard statistics
 */
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSiteSettingsUrl: () => string;
/**
 * @summary Get site settings
 */
export declare const getSiteSettings: (options?: RequestInit) => Promise<SiteSettings>;
export declare const getGetSiteSettingsQueryKey: () => readonly ["/api/settings"];
export declare const getGetSiteSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getSiteSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSiteSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSiteSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSiteSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSiteSettings>>>;
export type GetSiteSettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get site settings
 */
export declare function useGetSiteSettings<TData = Awaited<ReturnType<typeof getSiteSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSiteSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateSiteSettingsUrl: () => string;
/**
 * @summary Update site settings
 */
export declare const updateSiteSettings: (siteSettingsUpdate: SiteSettingsUpdate, options?: RequestInit) => Promise<SiteSettings>;
export declare const getUpdateSiteSettingsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSiteSettings>>, TError, {
        data: BodyType<SiteSettingsUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSiteSettings>>, TError, {
    data: BodyType<SiteSettingsUpdate>;
}, TContext>;
export type UpdateSiteSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSiteSettings>>>;
export type UpdateSiteSettingsMutationBody = BodyType<SiteSettingsUpdate>;
export type UpdateSiteSettingsMutationError = ErrorType<unknown>;
/**
* @summary Update site settings
*/
export declare const useUpdateSiteSettings: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSiteSettings>>, TError, {
        data: BodyType<SiteSettingsUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSiteSettings>>, TError, {
    data: BodyType<SiteSettingsUpdate>;
}, TContext>;
export declare const getListStatesUrl: () => string;
/**
 * @summary List all states
 */
export declare const listStates: (options?: RequestInit) => Promise<State[]>;
export declare const getListStatesQueryKey: () => readonly ["/api/states"];
export declare const getListStatesQueryOptions: <TData = Awaited<ReturnType<typeof listStates>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStates>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStatesQueryResult = NonNullable<Awaited<ReturnType<typeof listStates>>>;
export type ListStatesQueryError = ErrorType<unknown>;
/**
 * @summary List all states
 */
export declare function useListStates<TData = Awaited<ReturnType<typeof listStates>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateStateUrl: () => string;
/**
 * @summary Create a state
 */
export declare const createState: (stateInput: StateInput, options?: RequestInit) => Promise<State>;
export declare const getCreateStateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createState>>, TError, {
        data: BodyType<StateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createState>>, TError, {
    data: BodyType<StateInput>;
}, TContext>;
export type CreateStateMutationResult = NonNullable<Awaited<ReturnType<typeof createState>>>;
export type CreateStateMutationBody = BodyType<StateInput>;
export type CreateStateMutationError = ErrorType<unknown>;
/**
* @summary Create a state
*/
export declare const useCreateState: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createState>>, TError, {
        data: BodyType<StateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createState>>, TError, {
    data: BodyType<StateInput>;
}, TContext>;
export declare const getGetStateUrl: (slug: string) => string;
/**
 * @summary Get state by slug
 */
export declare const getState: (slug: string, options?: RequestInit) => Promise<State>;
export declare const getGetStateQueryKey: (slug: string) => readonly [`/api/states/${string}`];
export declare const getGetStateQueryOptions: <TData = Awaited<ReturnType<typeof getState>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getState>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getState>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStateQueryResult = NonNullable<Awaited<ReturnType<typeof getState>>>;
export type GetStateQueryError = ErrorType<void>;
/**
 * @summary Get state by slug
 */
export declare function useGetState<TData = Awaited<ReturnType<typeof getState>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getState>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateStateUrl: (slug: string) => string;
/**
 * @summary Update a state
 */
export declare const updateState: (slug: string, stateUpdate: StateUpdate, options?: RequestInit) => Promise<State>;
export declare const getUpdateStateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateState>>, TError, {
        slug: string;
        data: BodyType<StateUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateState>>, TError, {
    slug: string;
    data: BodyType<StateUpdate>;
}, TContext>;
export type UpdateStateMutationResult = NonNullable<Awaited<ReturnType<typeof updateState>>>;
export type UpdateStateMutationBody = BodyType<StateUpdate>;
export type UpdateStateMutationError = ErrorType<unknown>;
/**
* @summary Update a state
*/
export declare const useUpdateState: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateState>>, TError, {
        slug: string;
        data: BodyType<StateUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateState>>, TError, {
    slug: string;
    data: BodyType<StateUpdate>;
}, TContext>;
export declare const getDeleteStateUrl: (slug: string) => string;
/**
 * @summary Delete a state
 */
export declare const deleteState: (slug: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteStateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteState>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteState>>, TError, {
    slug: string;
}, TContext>;
export type DeleteStateMutationResult = NonNullable<Awaited<ReturnType<typeof deleteState>>>;
export type DeleteStateMutationError = ErrorType<unknown>;
/**
* @summary Delete a state
*/
export declare const useDeleteState: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteState>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteState>>, TError, {
    slug: string;
}, TContext>;
export declare const getBulkImportStatesUrl: () => string;
/**
 * @summary Bulk import states (admin)
 */
export declare const bulkImportStates: (bulkStateImport: BulkStateImport, options?: RequestInit) => Promise<BulkImportResult>;
export declare const getBulkImportStatesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof bulkImportStates>>, TError, {
        data: BodyType<BulkStateImport>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof bulkImportStates>>, TError, {
    data: BodyType<BulkStateImport>;
}, TContext>;
export type BulkImportStatesMutationResult = NonNullable<Awaited<ReturnType<typeof bulkImportStates>>>;
export type BulkImportStatesMutationBody = BodyType<BulkStateImport>;
export type BulkImportStatesMutationError = ErrorType<unknown>;
/**
* @summary Bulk import states (admin)
*/
export declare const useBulkImportStates: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof bulkImportStates>>, TError, {
        data: BodyType<BulkStateImport>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof bulkImportStates>>, TError, {
    data: BodyType<BulkStateImport>;
}, TContext>;
export declare const getBulkImportCitiesUrl: () => string;
/**
 * @summary Bulk import cities (admin)
 */
export declare const bulkImportCities: (bulkCityImport: BulkCityImport, options?: RequestInit) => Promise<BulkImportResult>;
export declare const getBulkImportCitiesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof bulkImportCities>>, TError, {
        data: BodyType<BulkCityImport>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof bulkImportCities>>, TError, {
    data: BodyType<BulkCityImport>;
}, TContext>;
export type BulkImportCitiesMutationResult = NonNullable<Awaited<ReturnType<typeof bulkImportCities>>>;
export type BulkImportCitiesMutationBody = BodyType<BulkCityImport>;
export type BulkImportCitiesMutationError = ErrorType<unknown>;
/**
* @summary Bulk import cities (admin)
*/
export declare const useBulkImportCities: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof bulkImportCities>>, TError, {
        data: BodyType<BulkCityImport>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof bulkImportCities>>, TError, {
    data: BodyType<BulkCityImport>;
}, TContext>;
export declare const getBulkImportCitiesCsvUrl: () => string;
/**
 * @summary Bulk import cities via CSV text (admin)
 */
export declare const bulkImportCitiesCsv: (bulkImportCitiesCsvBody: BulkImportCitiesCsvBody, options?: RequestInit) => Promise<BulkImportResult>;
export declare const getBulkImportCitiesCsvMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof bulkImportCitiesCsv>>, TError, {
        data: BodyType<BulkImportCitiesCsvBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof bulkImportCitiesCsv>>, TError, {
    data: BodyType<BulkImportCitiesCsvBody>;
}, TContext>;
export type BulkImportCitiesCsvMutationResult = NonNullable<Awaited<ReturnType<typeof bulkImportCitiesCsv>>>;
export type BulkImportCitiesCsvMutationBody = BodyType<BulkImportCitiesCsvBody>;
export type BulkImportCitiesCsvMutationError = ErrorType<unknown>;
/**
* @summary Bulk import cities via CSV text (admin)
*/
export declare const useBulkImportCitiesCsv: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof bulkImportCitiesCsv>>, TError, {
        data: BodyType<BulkImportCitiesCsvBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof bulkImportCitiesCsv>>, TError, {
    data: BodyType<BulkImportCitiesCsvBody>;
}, TContext>;
export declare const getListCitiesUrl: (params?: ListCitiesParams) => string;
/**
 * @summary List all cities
 */
export declare const listCities: (params?: ListCitiesParams, options?: RequestInit) => Promise<CityListResponse>;
export declare const getListCitiesQueryKey: (params?: ListCitiesParams) => readonly ["/api/cities", ...ListCitiesParams[]];
export declare const getListCitiesQueryOptions: <TData = Awaited<ReturnType<typeof listCities>>, TError = ErrorType<unknown>>(params?: ListCitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCitiesQueryResult = NonNullable<Awaited<ReturnType<typeof listCities>>>;
export type ListCitiesQueryError = ErrorType<unknown>;
/**
 * @summary List all cities
 */
export declare function useListCities<TData = Awaited<ReturnType<typeof listCities>>, TError = ErrorType<unknown>>(params?: ListCitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCityUrl: () => string;
/**
 * @summary Create a city
 */
export declare const createCity: (cityInput: CityInput, options?: RequestInit) => Promise<City>;
export declare const getCreateCityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCity>>, TError, {
        data: BodyType<CityInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCity>>, TError, {
    data: BodyType<CityInput>;
}, TContext>;
export type CreateCityMutationResult = NonNullable<Awaited<ReturnType<typeof createCity>>>;
export type CreateCityMutationBody = BodyType<CityInput>;
export type CreateCityMutationError = ErrorType<unknown>;
/**
* @summary Create a city
*/
export declare const useCreateCity: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCity>>, TError, {
        data: BodyType<CityInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCity>>, TError, {
    data: BodyType<CityInput>;
}, TContext>;
export declare const getGetCityUrl: (slug: string) => string;
/**
 * @summary Get city by slug
 */
export declare const getCity: (slug: string, options?: RequestInit) => Promise<City>;
export declare const getGetCityQueryKey: (slug: string) => readonly [`/api/cities/${string}`];
export declare const getGetCityQueryOptions: <TData = Awaited<ReturnType<typeof getCity>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCityQueryResult = NonNullable<Awaited<ReturnType<typeof getCity>>>;
export type GetCityQueryError = ErrorType<void>;
/**
 * @summary Get city by slug
 */
export declare function useGetCity<TData = Awaited<ReturnType<typeof getCity>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCityUrl: (slug: string) => string;
/**
 * @summary Update a city
 */
export declare const updateCity: (slug: string, cityUpdate: CityUpdate, options?: RequestInit) => Promise<City>;
export declare const getUpdateCityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCity>>, TError, {
        slug: string;
        data: BodyType<CityUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCity>>, TError, {
    slug: string;
    data: BodyType<CityUpdate>;
}, TContext>;
export type UpdateCityMutationResult = NonNullable<Awaited<ReturnType<typeof updateCity>>>;
export type UpdateCityMutationBody = BodyType<CityUpdate>;
export type UpdateCityMutationError = ErrorType<unknown>;
/**
* @summary Update a city
*/
export declare const useUpdateCity: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCity>>, TError, {
        slug: string;
        data: BodyType<CityUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCity>>, TError, {
    slug: string;
    data: BodyType<CityUpdate>;
}, TContext>;
export declare const getDeleteCityUrl: (slug: string) => string;
/**
 * @summary Delete a city
 */
export declare const deleteCity: (slug: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteCityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCity>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCity>>, TError, {
    slug: string;
}, TContext>;
export type DeleteCityMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCity>>>;
export type DeleteCityMutationError = ErrorType<unknown>;
/**
* @summary Delete a city
*/
export declare const useDeleteCity: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCity>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCity>>, TError, {
    slug: string;
}, TContext>;
export declare const getListListingsUrl: (params?: ListListingsParams) => string;
/**
 * @summary List all listings
 */
export declare const listListings: (params?: ListListingsParams, options?: RequestInit) => Promise<ListingPage>;
export declare const getListListingsQueryKey: (params?: ListListingsParams) => readonly ["/api/listings", ...ListListingsParams[]];
export declare const getListListingsQueryOptions: <TData = Awaited<ReturnType<typeof listListings>>, TError = ErrorType<unknown>>(params?: ListListingsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listListings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listListings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListListingsQueryResult = NonNullable<Awaited<ReturnType<typeof listListings>>>;
export type ListListingsQueryError = ErrorType<unknown>;
/**
 * @summary List all listings
 */
export declare function useListListings<TData = Awaited<ReturnType<typeof listListings>>, TError = ErrorType<unknown>>(params?: ListListingsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listListings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateListingUrl: () => string;
/**
 * @summary Create a listing
 */
export declare const createListing: (listingInput: ListingInput, options?: RequestInit) => Promise<Listing>;
export declare const getCreateListingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createListing>>, TError, {
        data: BodyType<ListingInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createListing>>, TError, {
    data: BodyType<ListingInput>;
}, TContext>;
export type CreateListingMutationResult = NonNullable<Awaited<ReturnType<typeof createListing>>>;
export type CreateListingMutationBody = BodyType<ListingInput>;
export type CreateListingMutationError = ErrorType<unknown>;
/**
* @summary Create a listing
*/
export declare const useCreateListing: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createListing>>, TError, {
        data: BodyType<ListingInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createListing>>, TError, {
    data: BodyType<ListingInput>;
}, TContext>;
export declare const getGetListingUrl: (id: number) => string;
/**
 * @summary Get listing by ID
 */
export declare const getListing: (id: number, options?: RequestInit) => Promise<Listing>;
export declare const getGetListingQueryKey: (id: number) => readonly [`/api/listings/${number}`];
export declare const getGetListingQueryOptions: <TData = Awaited<ReturnType<typeof getListing>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getListing>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getListing>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetListingQueryResult = NonNullable<Awaited<ReturnType<typeof getListing>>>;
export type GetListingQueryError = ErrorType<void>;
/**
 * @summary Get listing by ID
 */
export declare function useGetListing<TData = Awaited<ReturnType<typeof getListing>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getListing>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateListingUrl: (id: number) => string;
/**
 * @summary Update a listing
 */
export declare const updateListing: (id: number, listingUpdate: ListingUpdate, options?: RequestInit) => Promise<Listing>;
export declare const getUpdateListingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateListing>>, TError, {
        id: number;
        data: BodyType<ListingUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateListing>>, TError, {
    id: number;
    data: BodyType<ListingUpdate>;
}, TContext>;
export type UpdateListingMutationResult = NonNullable<Awaited<ReturnType<typeof updateListing>>>;
export type UpdateListingMutationBody = BodyType<ListingUpdate>;
export type UpdateListingMutationError = ErrorType<unknown>;
/**
* @summary Update a listing
*/
export declare const useUpdateListing: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateListing>>, TError, {
        id: number;
        data: BodyType<ListingUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateListing>>, TError, {
    id: number;
    data: BodyType<ListingUpdate>;
}, TContext>;
export declare const getDeleteListingUrl: (id: number) => string;
/**
 * @summary Delete a listing
 */
export declare const deleteListing: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteListingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteListing>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteListing>>, TError, {
    id: number;
}, TContext>;
export type DeleteListingMutationResult = NonNullable<Awaited<ReturnType<typeof deleteListing>>>;
export type DeleteListingMutationError = ErrorType<unknown>;
/**
* @summary Delete a listing
*/
export declare const useDeleteListing: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteListing>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteListing>>, TError, {
    id: number;
}, TContext>;
export declare const getListSeoPagesUrl: () => string;
/**
 * @summary List all SEO pages
 */
export declare const listSeoPages: (options?: RequestInit) => Promise<SeoPage[]>;
export declare const getListSeoPagesQueryKey: () => readonly ["/api/seo-pages"];
export declare const getListSeoPagesQueryOptions: <TData = Awaited<ReturnType<typeof listSeoPages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSeoPages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSeoPages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSeoPagesQueryResult = NonNullable<Awaited<ReturnType<typeof listSeoPages>>>;
export type ListSeoPagesQueryError = ErrorType<unknown>;
/**
 * @summary List all SEO pages
 */
export declare function useListSeoPages<TData = Awaited<ReturnType<typeof listSeoPages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSeoPages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateSeoPageUrl: () => string;
/**
 * @summary Create an SEO page
 */
export declare const createSeoPage: (seoPageInput: SeoPageInput, options?: RequestInit) => Promise<SeoPage>;
export declare const getCreateSeoPageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSeoPage>>, TError, {
        data: BodyType<SeoPageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSeoPage>>, TError, {
    data: BodyType<SeoPageInput>;
}, TContext>;
export type CreateSeoPageMutationResult = NonNullable<Awaited<ReturnType<typeof createSeoPage>>>;
export type CreateSeoPageMutationBody = BodyType<SeoPageInput>;
export type CreateSeoPageMutationError = ErrorType<unknown>;
/**
* @summary Create an SEO page
*/
export declare const useCreateSeoPage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSeoPage>>, TError, {
        data: BodyType<SeoPageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSeoPage>>, TError, {
    data: BodyType<SeoPageInput>;
}, TContext>;
export declare const getGetSeoPageUrl: (slug: string) => string;
/**
 * @summary Get SEO page by slug
 */
export declare const getSeoPage: (slug: string, options?: RequestInit) => Promise<SeoPage>;
export declare const getGetSeoPageQueryKey: (slug: string) => readonly [`/api/seo-pages/${string}`];
export declare const getGetSeoPageQueryOptions: <TData = Awaited<ReturnType<typeof getSeoPage>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSeoPage>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSeoPage>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSeoPageQueryResult = NonNullable<Awaited<ReturnType<typeof getSeoPage>>>;
export type GetSeoPageQueryError = ErrorType<void>;
/**
 * @summary Get SEO page by slug
 */
export declare function useGetSeoPage<TData = Awaited<ReturnType<typeof getSeoPage>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSeoPage>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateSeoPageUrl: (slug: string) => string;
/**
 * @summary Update an SEO page
 */
export declare const updateSeoPage: (slug: string, seoPageUpdate: SeoPageUpdate, options?: RequestInit) => Promise<SeoPage>;
export declare const getUpdateSeoPageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSeoPage>>, TError, {
        slug: string;
        data: BodyType<SeoPageUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSeoPage>>, TError, {
    slug: string;
    data: BodyType<SeoPageUpdate>;
}, TContext>;
export type UpdateSeoPageMutationResult = NonNullable<Awaited<ReturnType<typeof updateSeoPage>>>;
export type UpdateSeoPageMutationBody = BodyType<SeoPageUpdate>;
export type UpdateSeoPageMutationError = ErrorType<unknown>;
/**
* @summary Update an SEO page
*/
export declare const useUpdateSeoPage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSeoPage>>, TError, {
        slug: string;
        data: BodyType<SeoPageUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSeoPage>>, TError, {
    slug: string;
    data: BodyType<SeoPageUpdate>;
}, TContext>;
export declare const getDeleteSeoPageUrl: (slug: string) => string;
/**
 * @summary Delete an SEO page
 */
export declare const deleteSeoPage: (slug: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteSeoPageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSeoPage>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSeoPage>>, TError, {
    slug: string;
}, TContext>;
export type DeleteSeoPageMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSeoPage>>>;
export type DeleteSeoPageMutationError = ErrorType<unknown>;
/**
* @summary Delete an SEO page
*/
export declare const useDeleteSeoPage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSeoPage>>, TError, {
        slug: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSeoPage>>, TError, {
    slug: string;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map