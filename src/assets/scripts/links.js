(function() {
    function ready() {
        const linkContainersAll = document.querySelectorAll('.js-link-container');
        const selectors = [...document.querySelectorAll('.js-tag-selector')];
        for (let selector of selectors) {
          selector.addEventListener('click', (e) => {
            const isSelected = e.target.classList.toggle('js-selected');
            if (isSelected) {
              document.numOfTagsSelected++;
            } else {
              document.numOfTagsSelected--;
            }
            const selectedTags = [...document.querySelectorAll('.js-selected')].map(i => i.innerHTML.substring(1));
            const numOfTagsSelected = selectedTags.length;
            if (numOfTagsSelected === 1) {
              for (let linkContainer of linkContainersAll) {
                linkContainer.classList.add('js-click');
              }
            } else if (numOfTagsSelected === 0) {
              for (let linkContainer of linkContainersAll) {
                linkContainer.classList.remove('js-click');
              }
            }
            for (let linkContainer of linkContainersAll) {
              let shouldShow = true;
              for (let selectedTag of selectedTags) {
                if (!linkContainer.classList.contains(`js-${selectedTag}`)) {
                  linkContainer.classList.remove('js-show');
                  shouldShow = false;
                  continue;
                }
              }
              shouldShow && linkContainer.classList.add('js-show')
            }
          });
        }
    }

    if (document.readyState === 'complete') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
  })(document);