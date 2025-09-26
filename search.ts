import { ISearchstaxSuggestProps, ISearchstaxSuggestResponse, Searchstax } from '@searchstax-inc/searchstudio-ux-js';
import { searchstaxConfig } from '../searchStaxConfig';
const searchstax = new Searchstax();

searchstax.initialize(searchstaxConfig);
// get query
function getQueryParam(name: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || '';
}

// header/footer search input
const headerInputs = document.querySelectorAll<HTMLInputElement>('.search-field');
headerInputs.forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const term = (e.target as HTMLInputElement).value.trim();
      if (term) {
        // Redirect to search page, preserving SearchStax query format
        window.location.href = `/?s=${encodeURIComponent(term)}&searchstax[query]=${encodeURIComponent(term)}&searchstax[page]=1&searchstax[model]=Default`;
      }
    }
  });
});
const searchButtons = document.querySelectorAll<HTMLButtonElement>('.search-button');
searchButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const form = button.closest('form');
    const input = form?.querySelector<HTMLInputElement>('.search-field');
    if (input && input.value.trim()) {
      const encodedTerm = encodeURIComponent(input.value.trim());
      window.location.href = `/?s=${encodedTerm}&searchstax[query]=${encodedTerm}&searchstax[page]=1&searchstax[model]=Default`;
    }
  });
});

// search results page
const resultsContainer = document.getElementById('searchstax-results-container');
if (resultsContainer) {
  const termFromUrl = getQueryParam('query') || getQueryParam('s'); // fall back to WP query

  // search input on results page
  searchstax.addSearchInputWidget("searchstax-input-container", {
    suggestAfterMinChars: 3,
    hooks: {
      afterAutosuggest: function (result: ISearchstaxSuggestResponse) {
        const copy = { ...result };
        return copy;
      },
      beforeAutosuggest: function (props: ISearchstaxSuggestProps) {
        const propsCopy = { ...props };
        return propsCopy;
      },
    },
    templates: {
      mainTemplate: {
        template: `
          <div class="site-search-page searchstax-search-input-container searchstax-search-input-container-new">
              <div class="searchstax-search-input-wrapper">
              <input type="text" id="searchstax-search-input" class="searchstax-search-input" placeholder="Search this site" aria-label="Search" />
              </div>
              <button class="search-page-button" id="searchstax-search-input-action-button" aria-label="Submit Search" role="button"></button>
          </div>
          `,
          searchInputId: "searchstax-search-input"
        },
        autosuggestItemTemplate: {
          template: `
<div class="searchstax-autosuggest-item-term-container">{{{term}}}</div>
            `,
          }
        },
      });

  searchstax.addSearchResultsWidget("searchstax-results-container", {
   defaultSearchTerm: termFromUrl,
   templates: {
    mainTemplate: {
      template: `
<section aria-label="search results container" tabindex="0">
<div class="searchstax-search-results-container" id="searchstax-search-results-container">
<div class="searchstax-search-results" id="searchstax-search-results"></div>
</div>
</section>
        `,
        searchResultsContainerId: "searchstax-search-results",
      },
      searchResultTemplate: {
        template: `
<div class="searchstax-search-result {{#thumbnail}} has-thumbnail {{/thumbnail}}">
                      {{#ribbon}}
<span>{{ribbon}}</span>
                      {{/ribbon}}
<div class="searchstax-search-result-content">
<div class="searchstax-search-result-title-wrapper">
<div class="searchstax-search-result-title-container">
<h2 class="searchstax-search-result-title">{{title}}</h2>
</div>
</div>
                      {{#description}}
<p class="searchstax-search-result-description searchstax-search-result-common">
                          {{description}}
</p>
                      {{/description}}

</div>
</div>
          `,
          searchResultUniqueIdAttribute: "data-searchstax-unique-result-id",
        },
        noSearchResultTemplate: {
          template: `
<div class="searchstax-no-results">
                  Sorry, we could not find any results pertaining to your search. 
<br>
                  {{#spellingSuggestion}}
<span>&nbsp;Did you mean <a href="#" aria-label="Did you mean: {{originalQuery}}" class="searchstax-suggestion-term" onclick="searchCallback('{{ spellingSuggestion }}')">{{ spellingSuggestion }}</a>?</span>
                  {{/spellingSuggestion}}
</div>
            `,
          },
        },
      });
  searchstax.addPaginationWidget("searchstax-pagination-container", {
    templates: {
      mainTemplate: {
        template: `
        {{#results.length}}

<div class="searchstax-pagination-container" data-test-id="searchstax-pagination-container">
<div class="searchstax-pagination-content">
<div class="item">
<a class="searchstax-pagination-previous {{#isFirstPage}}disabled{{/isFirstPage}}" id="searchstax-pagination-previous" data-test-id="searchstax-pagination-previous" tabindex="0" aria-label="Previous Page">
<img class=" previous-icon" src="https://cdn.brand.illinois.edu/illinois.edu/arrow/left/blue.svg" />Previous</a>
</div>
<div class="item searchstax-pagination-details" data-test-id="searchstax-pagination-details">
              {{startResultIndex}} - {{endResultIndex}} of {{totalResults}}
</div>
<div class="item">
<a class="searchstax-pagination-next {{#isLastPage}}disabled{{/isLastPage}}" data-test-id="searchstax-pagination-next" id="searchstax-pagination-next" tabindex="0" aria-label="Next Page">
               Next<img class="previous-icon" src="https://cdn.brand.illinois.edu/illinois.edu/arrow/right/blue.svg" /></a>
</div>
</div>
</div>

        {{/results.length}}
          `,
          previousButtonClass: "searchstax-pagination-previous",
          nextButtonClass: "searchstax-pagination-next"
        }
      },
    });
}
searchstax.addSearchFeedbackWidget("search-feedback-container", {
  templates: {
    main: {
      template: `
        {{#searchExecuted}}
<h2 class="searchstax-feedback-container" data-test-id="searchstax-feedback-container">
                 Searching for <span> {{#searchTerm}} {{searchTerm}} {{/searchTerm}} </span>
</h2>
<p> <b>Found {{totalResults}} results</b> <br> 
            {{#hasResults}}
            Viewing results {{startResultIndex}} - {{endResultIndex}} </p>
            {{/hasResults}}
        {{/searchExecuted}}
        `,
        originalQueryClass: `searchstax-feedback-original-query`
      }
    },
  });


  searchstax.addFacetsWidget("searchstax-facets-container", {
    facetingType: "or", // Available Options": "and" | "or" | "showUnavailable" | "tabs";
    itemsPerPageDesktop: 6,
    itemsPerPageMobile: 99,
    templates: {
        mainTemplateDesktop: {
            template: `
      {{#hasResultsOrExternalPromotions}}
        <div class="searchstax-facets-container-desktop">
        </div>
      {{/hasResultsOrExternalPromotions}}
      `,
            facetsContainerId: "",
        },
        mainTemplateMobile: {
            template: `
        <div class="searchstax-facets-pills-container">
          <div class="searchstax-facets-pills-selected">
          </div>
        </div>

        <div class="searchstax-facets-mobile-overlay {{#overlayOpened}} searchstax-show{{/overlayOpened}}" >
          <div class="searchstax-facets-mobile-overlay-header">
            <div class="searchstax-facets-mobile-overlay-header-title"></div>
            <div class="searchstax-search-close"></div>
          </div>
          <div class="searchstax-facets-container-mobile"></div>
        </div>
      `,
            facetsContainerClass: `searchstax-facets-container-mobile`,
            closeOverlayTriggerClasses: ["searchstax-facets-mobile-overlay-done","searchstax-search-close",],
            filterByContainerClass: `searchstax-facets-pills-container`,
            selectedFacetsContainerClass: `searchstax-facets-pills-selected`,
        },
        showMoreButtonContainerTemplate: {
            template: `
      <div class="searchstax-facet-show-more-container">
      {{#showingAllFacets}}
        <div class="searchstax-facet-show-less-button searchstax-facet-show-button">less</div>
      {{/showingAllFacets}}
      {{^showingAllFacets}}
        <div class="searchstax-facet-show-more-button  searchstax-facet-show-button">more {{onShowMoreLessClick}}</div>
      {{/showingAllFacets}}
    </div>
      `,
            showMoreButtonClass: `searchstax-facet-show-more-container`,
        },
        facetItemContainerTemplate: {
            template: `
      <div>
        <div class="searchstax-facet-title-container">
            <div class="searchstax-facet-title">
            {{label}}
            </div>
            <div class="searchstax-facet-title-arrow active"></div>
        </div>
         <div class="searchstax-facet-values-container" aria-live="polite"></div>
      </div>
      `,
            facetListTitleContainerClass: `searchstax-facet-title-container`,
            facetListContainerClass: `searchstax-facet-values-container`,
        },
        clearFacetsTemplate: {
            template: `
      {{#shouldShow}}}
      
        <div class="searchstax-facets-pill searchstax-clear-filters searchstax-facets-pill-clear-all">
            <div class="searchstax-facets-pill-label">Reset All</div>
        </div>

      {{/shouldShow}}
      `,
            containerClass: `searchstax-facets-pill-clear-all`,
        },
        facetItemTemplate: {
            template: `
      <div class="searchstax-facet-input">
        <input type="checkbox" class="searchstax-facet-input-checkbox" {{#disabled}}disabled{{/disabled}} {{#isChecked}}checked{{/isChecked}}/>
      </div>
      <div class="searchstax-facet-value-label">{{value}}</div>
      <div class="searchstax-facet-value-count">({{count}})</div>
      `,
            inputCheckboxClass: `searchstax-facet-input-checkbox`,
            checkTriggerClasses: ["searchstax-facet-value-label","searchstax-facet-value-count",],
        },
        filterByTemplate: {
            template: `
      <div class="searchstax-facets-pill searchstax-facets-pill-filter-by">
        <div class="searchstax-facets-pill-label">Filter By</div>
      </div>
      `,
            containerClass: `searchstax-facets-pill-filter-by`,
        },
        selectedFacetsTemplate: {
            template: `
      <div class="searchstax-facets-pill searchstax-facets-pill-facets">
        <div class="searchstax-facets-pill-label">{{value}} ({{count}})</div>
        <div class="searchstax-facets-pill-icon-close"></div>
      </div>
      `,
            containerClass: `searchstax-facets-pill-facets`,
        },

    },
  });