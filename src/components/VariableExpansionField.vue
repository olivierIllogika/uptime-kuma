<template>
    <div class="mb-3">
        <label  class="form-label">{{ $t("emailCustomBody") }} id:{{ id }}</label>
        <input  v-model="model"
                type="text" 
                class="form-control" 
                autocomplete="false" 
                :placeholder="placeholder">

        <ToggleSection :heading="$t('variableReference')">

            <div v-pre class="form-text">
                (leave blank for default one)<br />
                Monitor:<br />
                {{NAME}}: Service Name<br />
                {{HOSTNAME}}: Hostname<br />
                {{HOSTNAME_OR_URL}}: Hostname or URL<br />
                {{INTERVAL}}: Heartbeat Interval<br />
                {{PORT}}: Port<br />
                {{TYPE}}: Monitor type<br />
                {{URL}}: URL<br />
                <br />
                Heartbeat:<br />
                {{DOWN_COUNT}}: Down count (if not zero)<br />
                {{DURATION}}: Duuration<br />
                {{IMPORTANT}}: Important if status changed<br />
                {{MSG}}: Message<br />
                {{PING}}: Last heartbeat ping<br />
                {{STATUS}}: Status<br />
                {{TIME_UTC}}: UTC Time<br />
                {{TIME:TimeZone}}: Time in specified time zone. Ex.: {{TIME:America/New_York}}<br />
                <br />
                Conditional:<br />
                {{IF_DOWN}}...{{END_DOWN}}: If down, keep text between tags<br />
                {{IF_UP}}...{{END_UP}}: If up, keep text between tags<br />
            </div>
        </ToggleSection>

    </div>


</template>

<script>

import ToggleSection from "./ToggleSection.vue";

export default {
    components: {
        ToggleSection
    },    
    props: {
        /** The value of the input */
        modelValue: {
            type: String,
            default: ""
        },
        id: String,
        blah: String
    },
    emits: [ "update:modelValue" ],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            }
        }
    },
//    data () {
//        return {
//          id: null
//        }
//    }, 
}
</script>